import articleDetail, { initialState } from '../articleDetail';
import {
  setStateAction,
  loadAction,
  reloadRepliesAction,
  loadAuthAction,
  searchRepliesAction,
  searchRepiedArticleAction,
} from '../fixtures/articleDetail';

describe('reducer: articleDetail', () => {
  it('handles SET_STATE', () => {
    expect(
      articleDetail(initialState, setStateAction).get('state')
    ).toMatchSnapshot();
  });

  it('handles LOAD', () => {
    expect(
      articleDetail(initialState, loadAction).get('data')
    ).toMatchSnapshot();
  });

  it('handles partial LOAD', () => {
    const stateAfterLoad = articleDetail(initialState, loadAction);
    expect(
      articleDetail(stateAfterLoad, reloadRepliesAction).get('data')
    ).toMatchSnapshot();
  });

  it('handles LOAD_AUTH', () => {
    const stateAfterLoad = articleDetail(initialState, loadAction);
    expect(
      articleDetail(stateAfterLoad, loadAuthAction).getIn([
        'data',
        'replyConnections',
      ])
    ).toMatchSnapshot();
  });

  it('handles LOAD_SEARCH_OF_REPLIES', () => {
    expect(
      articleDetail(initialState, searchRepliesAction).getIn([
        'data',
        'searchReplies',
      ])
    ).toMatchSnapshot();
  });

  it('handles LOAD_SEARCH_OF_ARTICLES', () => {
    expect(
      articleDetail(initialState, searchRepiedArticleAction).getIn([
        'data',
        'searchArticles',
      ])
    ).toMatchSnapshot();
  });
});
