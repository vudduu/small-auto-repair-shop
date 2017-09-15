import {
  CREATE_ACCOUNT,
  LOGIN_ACCOUNT,
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
  const { username, role } = action;
  return {
    ...state,
    username,
    role,
    logged: true,
  };
};

export default function (state = defaultAccountState, action = {}) {
  switch (action.type) {
    case CREATE_ACCOUNT:
      return state;
    case LOGIN_ACCOUNT:
      return handleLoginAccount(state, action);
    default:
      return state;
  }
}
