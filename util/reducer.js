export const commonSetState = (state, { payload: { key, value } }) =>
  state.setIn(['state', key], value);
