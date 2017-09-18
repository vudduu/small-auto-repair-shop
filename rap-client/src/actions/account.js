import {
  CREATE_ACCOUNT,
  LOGIN_ACCOUNT,
  LOGOUT_ACCOUNT,
} from '../constants';

import { client } from '../api';

export function loginAccount(username, password) {
  return dispatch => (
    client.login(username, password)
      .then((res) => {
        if (res.username && res.password) {
          dispatch({
            type: LOGIN_ACCOUNT,
            ...res,
          });
        }
        return res;
      })
  );
}

export function logoutAccount() {
  return dispatch => (
    client.logout().then((res) => {
      dispatch({
        type: LOGOUT_ACCOUNT,
        ...res,
      });
    })
  );
}

export function getAuth() {
  return dispatch => (
    client.getAuth().then((res) => {
      if (res.success) {
        dispatch({
          type: LOGIN_ACCOUNT,
          ...res,
        });
      } else {
        dispatch({ type: LOGOUT_ACCOUNT });
      }
    })
  );
}

export function registerAccount(username, password, name, email, role) {
  return dispatch => (
    client.registerAccount(username, password, name, email, role)
      .then((res) => {
        dispatch({
          type: CREATE_ACCOUNT,
          ...res,
        });
        return res;
      })
  );
}

