import articleDetail, { initialState } from '../articleDetail';
import {
  setStateAction,
  loadAction,
  reloadRepliesAction,
  loadAuthAction,
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
});
