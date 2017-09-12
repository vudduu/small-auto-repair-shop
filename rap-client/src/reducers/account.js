import {
  CREATE_ACCOUNT,
} from '../constants';

export default function (state = {}, action = {}) {
  switch (action.type) {
    case CREATE_ACCOUNT:
      // console.log(CREATE_ACCOUNT, action);
      return { ...state, a: state.a + 1 || 0 };
    default:
      return state;
  }
}
