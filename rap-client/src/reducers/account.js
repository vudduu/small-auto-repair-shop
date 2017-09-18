/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import {
  CREATE_ACCOUNT,
  LOGIN_ACCOUNT,
  LOGOUT_ACCOUNT,
} from '../constants';

export const VISITOR = 1;
export const REGULAR = 2;
export const MANAGER = 3;
export const ADMIN = 4;
export const SUPER_USER = 5;

const defaultAccountState = {
  logged: false,
  role: VISITOR, // visitor by default
};

const handleLoginAccount = (state, action) => {
  const { data } = action;
  return {
    ...state,
    logged: true,
    enabled: data.enabled || 0,
    id: data._id || state.id,
    username: data.username || state.username,
    name: data.name || state.name,
    email: data.email || state.email,
    role: data.role || state.role,
  };
};

const handleLogoutAccount = () => defaultAccountState;

export default function (state = defaultAccountState, action = {}) {
  switch (action.type) {
    case CREATE_ACCOUNT:
      return state;
    case LOGIN_ACCOUNT:
      return handleLoginAccount(state, action);
    case LOGOUT_ACCOUNT:
      return handleLogoutAccount();
    default:
      return state;
  }
}
