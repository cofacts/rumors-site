import { createDuck } from 'redux-duck';
import { fromJS, Map, List, Set } from 'immutable';
import { waitForAuth } from './auth';
import gql from '../util/gql';
import NProgress from 'nprogress';

const { defineType, createAction, createReducer } = createDuck('articleDetail');

// Action Types
//

const LOAD = defineType('LOAD');
const LOAD_AUTH = defineType('LOAD_AUTH');
const SET_STATE = defineType('SET_STATE');
const RESET = defineType('RESET');
const LOAD_SEARCH_OF_ARTICLES = defineType('LOAD_SEARCH_OF_ARTICLES');
const LOAD_SEARCH_OF_REPLIES = defineType('LOAD_SEARCH_OF_REPLIES');

// Action creators
//
const fragments = {
  articleFields: `
    fragment articleFields on Article {
      id
      text
      replyRequestCount
      replyCount
      createdAt
      references {
        type
      }
    }
  `,
  articleReplyAndUserFields: `
    fragment userFields on User {
      id
      name
      avatarUrl
    }
    fragment articleReplyFields on ArticleReply {
      canUpdateStatus
      status
      articleId
      replyId
      reply {
        id
        user {
          ...userFields
        }
        type
        text
        reference
      }
      feedbacks {
        user{
          id
        }
        score
      }
      user { ...userFields }
      createdAt
    }
  `,
};

const loadData = createAction(LOAD);
const setState = createAction(SET_STATE);

export const load = id => dispatch => {
  dispatch(setState({ key: 'isLoading', value: true }));
  return gql`
    query($id: String!) {
      GetArticle(id: $id) {
        ...articleFields
        user { ...userFields }
        replyConnections: articleReplies { ...articleReplyFields }
        relatedArticles(filter: {replyCount: {GT: 0}}) {
          edges {
            node {
              ...articleFields
              user { ...userFields }
              replyCount
              replyConnections: articleReplies { ...articleReplyFields }
            }
            score
          }
        }
      }
    }
    ${fragments.articleFields}
    ${fragments.articleReplyAndUserFields}
  `({ id }).then(resp => {
    dispatch(loadData(resp.getIn(['data', 'GetArticle'])));
    dispatch(setState({ key: 'isLoading', value: false }));
  });
};

export const loadAuth = id => dispatch => {
  dispatch(setState({ key: 'isAuthLoading', value: true }));
  return waitForAuth
    .then(() =>
      gql`
        query($id: String!) {
          GetArticle(id: $id) {
            replyConnections: articleReplies {
              articleId
              replyId
              canUpdateStatus
            }
          }
        }
      `({ id })
    )
    .then(resp => {
      dispatch(createAction(LOAD_AUTH)(resp.getIn(['data', 'GetArticle'])));
      dispatch(setState({ key: 'isAuthLoading', value: false }));
    });
};

export const reset = createAction(RESET);

const reloadReply = articleId => dispatch =>
  gql`
    query($id: String!) {
      GetArticle(id: $id) {
        replyConnections: articleReplies {
          ...articleReplyFields
        }
      }
    }
    ${fragments.articleReplyAndUserFields}
  `({ id: articleId }).then(resp => {
    dispatch(loadData(resp.getIn(['data', 'GetArticle'])));
    dispatch(setState({ key: 'isReplyLoading', value: false }));
  });

export const connectReply = (articleId, replyId) => dispatch => {
  dispatch(setState({ key: 'isReplyLoading', value: true }));
  NProgress.start();
  return gql`
    mutation($articleId: String!, $replyId: String!) {
      CreateArticleReply(articleId: $articleId, replyId: $replyId) {
        articleId
      }
    }
  `({ articleId, replyId }).then(() => {
    dispatch(reloadReply(articleId));
    NProgress.done();
  });
};

export const updateArticleReplyStatus = (
  articleId,
  replyId,
  status
) => dispatch => {
  dispatch(setState({ key: 'isReplyLoading', value: true }));
  NProgress.start();
  return gql`
    mutation(
      $articleId: String!
      $replyId: String!
      $status: ArticleReplyStatusEnum!
    ) {
      UpdateArticleReplyStatus(
        articleId: $articleId
        replyId: $replyId
        status: $status
      ) {
        status
      }
    }
  `({ articleId, replyId, status }).then(() => {
    dispatch(reloadReply(articleId));
    NProgress.done();
  });
};

export const submitReply = params => dispatch => {
  dispatch(setState({ key: 'isReplyLoading', value: true }));
  NProgress.start();
  return gql`
    mutation(
      $articleId: String!
      $text: String!
      $type: ReplyTypeEnum!
      $reference: String
    ) {
      CreateReply(
        articleId: $articleId
        text: $text
        type: $type
        reference: $reference
      ) {
        id
      }
    }
  `(params).then(() => {
    dispatch(reloadReply(params.articleId));
    NProgress.done();
  });
};

export const voteReply = (articleId, replyId, vote) => dispatch => {
  dispatch(setState({ key: 'isReplyLoading', value: true }));
  NProgress.start();
  return gql`
    mutation($articleId: String!, $replyId: String!, $vote: FeedbackVote!) {
      CreateOrUpdateArticleReplyFeedback(
        articleId: $articleId
        replyId: $replyId
        vote: $vote
      ) {
        feedbackCount
      }
    }
  `({ articleId, replyId, vote }).then(() => {
    dispatch(reloadReply(articleId));
    NProgress.done();
  });
};

export const searchReplies = ({ q }) => dispatch => {
  return gql`
    query(
      $filter: ListReplyFilter
      $orderBy: [ListReplyOrderBy]
      $before: String
    ) {
      ListReplies(
        filter: $filter
        orderBy: $orderBy
        before: $before
        first: 25
      ) {
        edges {
          cursor
          node {
            id
            text
            type
            createdAt
            replyConnections: articleReplies {
              article {
                id
                text
              }
            }
          }
        }
      }
    }
  `({
    filter: {
      moreLikeThis: {
        like: q,
        minimumShouldMatch: '0',
      },
    },
    orderBy: {
      _score: 'DESC',
    },
    first: 25,
  }).then(resp => {
    dispatch(
      createAction(LOAD_SEARCH_OF_REPLIES)(
        resp.getIn(['data', 'ListReplies', 'edges'], List())
      )
    );
  });
};

export const searchRepiedArticle = ({ q }) => dispatch => {
  return gql`
    query(
      $filter: ListArticleFilter
      $orderBy: [ListArticleOrderBy]
      $before: String
    ) {
      ListArticles(
        filter: $filter
        orderBy: $orderBy
        before: $before
        first: 25
      ) {
        edges {
          node {
            id
            text
            replyCount
            createdAt
            replyConnections: articleReplies {
              reply {
                id
                text
                createdAt
                type
              }
            }
          }
        }
      }
    }
  `({
    filter: {
      moreLikeThis: {
        like: q,
        minimumShouldMatch: '0',
      },
      replyCount: { GT: '1' },
    },
    orderBy: {
      _score: 'DESC',
    },
    first: 25,
  }).then(resp => {
    dispatch(
      createAction(LOAD_SEARCH_OF_ARTICLES)(
        resp.getIn(['data', 'ListArticles', 'edges'], List())
      )
    );
  });
};

// Reducer
//

export const initialState = fromJS({
  state: { isLoading: false, isAuthLoading: false, isReplyLoading: false },
  data: {
    // data from server
    article: null,
    replyConnections: [], // reply & its connection to this article
    relatedArticles: [],
    relatedReplies: [], // related list of {article, reply}
    searchArticles: [],
    searchReplies: [], // list of {article, reply}
  },
});

export default createReducer(
  {
    [SET_STATE]: (state, { payload: { key, value } }) =>
      state.setIn(['state', key], value),

    [LOAD]: (state, { payload }) => {
      const relatedArticleEdges =
        payload.getIn(['relatedArticles', 'edges']) || List();

      const replyIds = Set(
        (payload.get('replyConnections') || List()).map(conn =>
          conn.getIn(['reply', 'id'])
        )
      );

      return state.withMutations(s =>
        s
          .updateIn(['data', 'article'], article =>
            (article || Map()).merge(
              payload.remove('replyConnections').remove('relatedArticles')
            )
          )
          .setIn(
            ['data', 'replyConnections'],
            payload
              .get('replyConnections')
              .sort(
                (a, b) =>
                  new Date(b.get('createdAt')) - new Date(a.get('createdAt'))
              )
          )
          .updateIn(
            ['data', 'relatedArticles'],
            articles =>
              !relatedArticleEdges.size
                ? articles
                : relatedArticleEdges.map(edge =>
                    edge.get('node').remove('replyConnections')
                  )
          )
          .updateIn(
            ['data', 'relatedReplies'],
            replies =>
              !relatedArticleEdges.size
                ? replies
                : relatedArticleEdges
                    .flatMap(edge =>
                      edge
                        .getIn(['node', 'replyConnections'])
                        .map(conn =>
                          conn.set(
                            'article',
                            edge.get('node').remove('replyConnections')
                          )
                        )
                        .filter(articleAndReply => {
                          const reply = articleAndReply.get('reply');
                          // Filter-out replies that is already re-used.
                          return reply && !replyIds.contains(reply.get('id'));
                        })
                    )
                    // De-duping replies using replyId, taking the reply with the most relavant article
                    // (which should come first)
                    //
                    .groupBy(articleAndReply =>
                      articleAndReply.getIn(['reply', 'id'])
                    )
                    .map(replyGroup => replyGroup.first())
                    .toList()
          )
      );
    },

    [LOAD_AUTH]: (state, { payload }) => {
      const idAuthMap = payload.get('replyConnections').reduce((agg, conn) => {
        agg[conn.get('replyId')] = conn;
        return agg;
      }, {});
      return state.updateIn(['data', 'replyConnections'], replyConnections =>
        replyConnections.map(conn => conn.merge(idAuthMap[conn.get('replyId')]))
      );
    },

    [LOAD_SEARCH_OF_REPLIES]: (state, { payload }) => {
      const reconstructSearchRepliesList = payload.map(reply => {
        return Map({
          article: reply.getIn(['node', 'replyConnections', 0, 'article']),
          reply: reply.get('node'),
        });
      });
      return state.setIn(
        ['data', 'searchReplies'],
        reconstructSearchRepliesList
      );
    },

    [LOAD_SEARCH_OF_ARTICLES]: (state, { payload }) => {
      const reconstructSearchArticlesList = payload.map(article => {
        return article.getIn(['node']);
      });

      return state.setIn(
        ['data', 'searchArticles'],
        reconstructSearchArticlesList
      );
    },

    [RESET]: state => state.set('data', initialState.get('data')),
  },
  initialState
);
