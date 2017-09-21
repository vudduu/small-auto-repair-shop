/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import {
  DELETE_ACCOUNT,
  LOAD_ACCOUNTS_LIST,
  ACCOUNTS_LIST_LOADING,
} from '../constants';

const defaultAccountsState = {
  accountsListLoading: false,
  accountsList: [],
};

function setAccountsListLoading(state, action) {
  return Object.assign({}, state, {
    accountsListLoading: action.value,
  });
}

function existsOnList(list, item) {
  return list.reduce((flag, aux) => (
    flag || item._id === aux._id
  ), false);
}

function loadAccountsList(state, action) {
  const { accounts } = action;
  const accountsFiltered = accounts.filter(account => (
    !existsOnList(state.accountsList, account)
  ));
  return Object.assign({}, state, {
    accountsListLoading: false,
    accountsList: [...state.accountsList, ...accountsFiltered],
  });
}

function removeUser(state, action) {
  const { accountId } = action;
  const accountsList = state.accountsList.filter(account => (
    accountId !== account._id
  ));
  return { ...state, accountsList };
}

export default function (state = defaultAccountsState, action = {}) {
  switch (action.type) {
    case LOAD_ACCOUNTS_LIST:
      return loadAccountsList(state, action);
    case ACCOUNTS_LIST_LOADING:
      return setAccountsListLoading(state, action);
    case DELETE_ACCOUNT:
      return removeUser(state, action);
    default:
      return state;
  }
}
