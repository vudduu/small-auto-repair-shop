/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import {
  CREATE_ACCOUNT,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  LOGIN_ACCOUNT,
  LOGOUT_ACCOUNT,
  LOAD_ACCOUNTS_LIST,
  LOAD_ACCOUNTS_IDS,
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
        // api test
        console.log(res);
        // client.repairCreate('59bfd5c9e12770d4a63acb2e', new Date(), 2).then((res2) => {
        //   console.log('repairCreate', res2);
        // });
        // client.repairUpdate(
        //   '59c69fb577e9ab083f51ea47',
        //   '59bfd5c9e12770d4a63acb2e',
        //   new Date(),
        //   4,
        //   0,
        // ).then((res3) => {
        //   console.log('repairUpdate', res3);
        // });
        // client.repairDelete('59c6a03b77e9ab083f51ea48').then((res6) => {
        //   console.log('59c6a03b77e9ab083f51ea48', res6);
        // });
        // client.addCommentRepair('59c69fb577e9ab083f51ea47', 'test comment').then((res5) => {
        //   console.log('addCommentRepair', res5);
        // });
        // client.getRepairsFromUser(0, '59bfd5c9e12770d4a63acb2e').then((res4) => {
        //   console.log('getRepairsFromUser', res4);
        // });
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

export function getAllAccountsIdsNames() {
  return (dispatch) => {
    dispatch({ type: ACCOUNTS_LIST_LOADING, value: true });
    return client.getAllAccountsIdsNames()
      .then((res) => {
        if (res.success) {
          dispatch({
            type: LOAD_ACCOUNTS_IDS,
            ...res,
          });
        } else {
          dispatch({ type: ACCOUNTS_LIST_LOADING, value: false });
        }
        return res;
      });
  };
}

export function getAccountById(accountId) {
  return (dispatch) => {
    dispatch({ type: ACCOUNTS_LIST_LOADING, value: true });
    return client.getAccountById(accountId)
      .then((res) => {
        if (res.success) {
          dispatch({
            type: LOAD_ACCOUNTS_LIST,
            accounts: [res.data],
          });
        } else {
          dispatch({ type: ACCOUNTS_LIST_LOADING, value: false });
        }
        return res;
      });
  };
}
