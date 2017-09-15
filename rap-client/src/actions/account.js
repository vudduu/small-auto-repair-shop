import {
  CREATE_ACCOUNT,
  LOGIN_ACCOUNT,
} from '../constants';

import { client } from '../api';

export function loadAccountData() {
  return (dispatch) => {
    dispatch({
      type: CREATE_ACCOUNT,
      test: 't',
    });
  };
}

export function loginAccount(username, password) {
  return dispatch => (
    client.login(username, password)
      .then((res) => {
        if (res.username && res.password) {
          dispatch({
            type: LOGIN_ACCOUNT,
            username,
          });
        }
        return res;
      })
      .catch((err) => {
        throw err;
      })
  );
}
