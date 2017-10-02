import { fromJS } from 'immutable';
import { commonSetState } from '../reducer';

describe('reducer', () => {
  describe('commonSetState', () => {
    const initState = fromJS({
      state: {
        foo: 'bar',
      },
    });
    it('sets state from payload', () => {
      expect(
        commonSetState(initState, {
          payload: { key: 'foo', value: 'bar2' },
        }).get('state')
      ).toMatchSnapshot();

      expect(
        commonSetState(initState, {
          payload: { key: 'not-exist-key', value: 'new-value' },
        }).get('state')
      ).toMatchSnapshot();
    });
  });
});
