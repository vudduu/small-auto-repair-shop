import {
  LOGIN_ACCOUNT,
  LOGOUT_ACCOUNT,
} from '../constants';

const STORAGE_USER_KEY = 'currentUserProfile';

const accountMiddleware = store => next => (action) => {
  const result = next(action);

  switch (action.type) {
    case LOGIN_ACCOUNT: {
      const { account } = store.getState();
      window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(account));
      break;
    }
    case LOGOUT_ACCOUNT:
      window.localStorage.removeItem(STORAGE_USER_KEY);
      break;
    default:
      break;
  }

  return result;
};

export default accountMiddleware;
