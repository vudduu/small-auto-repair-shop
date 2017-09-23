/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import {
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  LOAD_ACCOUNTS_LIST,
  ACCOUNTS_LIST_LOADING,
  LOAD_ACCOUNTS_IDS,
} from '../constants';

const defaultAccountsState = {
  accountsListLoading: false,
  accountsList: [],
  accountsIds: [],
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

function loadAccountsIds(state, action) {
  return { ...state, accountsIds: action.accounts };
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

function handleRemoveUser(state, action) {
  const { accountId } = action;
  const accountsList = state.accountsList.filter(account => (
    accountId !== account._id
  ));
  return { ...state, accountsList };
}

function handleUpdateAccount(state, action) {
  const accountsList = state.accountsList.map((account) => {
    if (action.accountId === account._id) {
      return {
        ...account,
        email: action.data.email,
        name: action.data.name,
        enabled: action.data.enabled,
        role: action.data.role,
      };
    }
    return account;
  });
  return { ...state, accountsList };
}

export default function (state = defaultAccountsState, action = {}) {
  switch (action.type) {
    case LOAD_ACCOUNTS_IDS:
      return loadAccountsIds(state, action);
    case LOAD_ACCOUNTS_LIST:
      return loadAccountsList(state, action);
    case ACCOUNTS_LIST_LOADING:
      return setAccountsListLoading(state, action);
    case DELETE_ACCOUNT:
      return handleRemoveUser(state, action);
    case UPDATE_ACCOUNT:
      return handleUpdateAccount(state, action);
    default:
      return state;
  }
}
