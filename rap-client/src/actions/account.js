/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import {
  CREATE_ACCOUNT,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  LOGIN_ACCOUNT,
  LOGOUT_ACCOUNT,
  LOAD_ACCOUNTS_LIST,
  ACCOUNTS_LIST_LOADING,
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

export function updateAccount(accountId, data) {
  return dispatch => (
    client.updateAccount(accountId, data)
      .then((res) => {
        dispatch({
          type: UPDATE_ACCOUNT,
          accountId,
          data,
        });
        return res;
      })
  );
}

export function deleteAccount(accountId) {
  return dispatch => (
    client.deleteAccount(accountId)
      .then((res) => {
        dispatch({
          type: DELETE_ACCOUNT,
          accountId,
        });
        return res;
      })
  );
}

export function getAccountsList(page = 0) {
  return (dispatch) => {
    dispatch({ type: ACCOUNTS_LIST_LOADING, value: true });
    return client.getAccountsList(page)
      .then((res) => {
        if (res.success) {
          dispatch({
            type: LOAD_ACCOUNTS_LIST,
            ...res,
          });
        } else {
          dispatch({ type: ACCOUNTS_LIST_LOADING, value: false });
        }
        return res;
      });
  };
}
