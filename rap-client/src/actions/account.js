import {
  CREATE_ACCOUNT,
} from '../constants';

export function loadAccountData() {
  return (dispatch) => {
    dispatch({
      type: CREATE_ACCOUNT,
      test: 't',
    });
  };
}

export function loadAccountData2() {
  return (dispatch) => {
    dispatch({
      type: CREATE_ACCOUNT,
      test: 't',
    });
  };
}
