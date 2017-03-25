import { createDuck } from 'redux-duck'
import { fromJS, Map, List, OrderedMap } from 'immutable'
import gql from '../util/gql'

const {defineType, createAction, createReducer} = createDuck('articleDetail');

// Action Types
//

const LOAD = defineType('LOAD');
const SET_STATE = defineType('SET_STATE');
const RESET = defineType('RESET');

// Action creators
//
const fragments = `
  fragment articleFields on Article {
    id
    text
    replyRequestCount
    replyCount
    references {
      createdAt
      type
    }
  }
  fragment userFields on User {
    name
    avatarUrl
  }
  fragment replyConnectionFields on ReplyConnection {
    id
    reply {
      id
      versions(limit: 1) {
        user {
          name
          avatarUrl
        }
        type
        text
        reference
        createdAt
      }
    }
    feedbackCount
    user { ...userFields }
  }
`;

const loadData = createAction(LOAD);
const setState = createAction(SET_STATE);

export const load = (id) => dispatch => {
  dispatch(setState({key: 'isLoading', value: true}));
  return gql`
    query($id: String!) {
      GetArticle(id: $id) {
        ...articleFields
        user { ...userFields }
        replyConnections { ...replyConnectionFields }
        relatedArticles(filter: {replyCount: {GT: 0}}) {
          edges {
            node {
              ...articleFields
              user { ...userFields }
              replyCount
              replyConnections { ...replyConnectionFields }
            }
            score
          }
        }
      }
    }
    ${ fragments }
  `({ id }).then(resp => {
    dispatch(loadData(resp.getIn(['data', 'GetArticle'])));
    dispatch(setState({key: 'isLoading', value: false}));
  });
}

export const reset = () => createAction(RESET);

const reloadReply = articleId => dispatch =>
  (gql`
    query($id: String!) {
      GetArticle(id: $id) {
        replyConnections {
          ...replyConnectionFields
        }
      }
    }
    ${ fragments }
  `({ id: articleId })).then( resp => {
    dispatch(loadData(resp.getIn(['data', 'GetArticle'])));
    dispatch(setState({key: 'isReplyLoading', value: false}));
  })

export const connectReply = (articleId, replyId) => dispatch => {
  dispatch(setState({key: 'isReplyLoading', value: true}));
  return gql`mutation($articleId: String!, $replyId: String!) {
    CreateReplyConnection(
      articleId: $articleId, replyId: $replyId,
    ) {
      id
    }
  }`({articleId, replyId}).then(() => dispatch(reloadReply(articleId)))
}

export const submitReply = params => dispatch => {
  dispatch(setState({key: 'isReplyLoading', value: true}));
  return gql`mutation(
    $articleId: String!, $text: String!, $type: ReplyTypeEnum!, $reference: String
  ) {
    CreateReply(
      articleId: $articleId, text: $text, type: $type, reference: $reference
    ) {
      id
    }
  }`(params).then(() => dispatch(reloadReply(params.articleId)))
}

// Reducer
//

const initialState = fromJS({
  state: {isLoading: false},
  data: { // data from server
    article: null,
    replyConnections: [], // reply & its connection to this article
    relatedArticles: [],
    relatedReplies: [], // related articles' replies
  },
});

export default createReducer({
  [SET_STATE]: (state, {payload: {key, value}}) => state.setIn(['state', key], value),

  [LOAD]: (state, {payload}) => {
    const articleEdges = payload.getIn(['relatedArticles', 'edges']) || List();
    const replyConnections = OrderedMap(
      articleEdges.flatMap(edge =>
        (edge.getIn(['node', 'replyConnections']) || List()).map(conn =>
          // we need to encode articleId into each replyConnection,
          // so that we can show link to the article in the related reply item.
          conn.set('articleId', edge.getIn(['node', 'id']))
        )
      ).map(conn => [conn.get('id'), conn])
    ).toList();

    return state.withMutations(s =>
      s
      .updateIn(['data', 'article'], (article) =>
        (article || Map()).merge(payload.filterNot((v, key) => key === 'replyConnections' || key === 'relatedArticles')))
      .setIn(['data', 'replyConnections'], payload.get('replyConnections'))
      .updateIn(['data', 'relatedArticles'], articles => !articleEdges.size ? articles : articleEdges.map(edge => edge.get('node')))
      .updateIn(['data', 'relatedReplies'], replies => !replyConnections.size ? replies : replyConnections.map(conn =>
        // get reply and articleId
        conn.get('reply').set('articleId', conn.get('articleId'))
      ).filter(reply => {
        const replyVersion = reply.getIn(['versions', 0]);
        return replyVersion.get('type') !== 'NOT_ARTICLE' && replyVersion.get('reference') !== ''
      }))
    )
  },
  [RESET]: (state) => state.set('data', initialState.get('data')),
}, initialState);
