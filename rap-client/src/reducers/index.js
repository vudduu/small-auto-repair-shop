import { combineReducers } from 'redux';

import account from './account';
import accounts from './accounts';

const rootReducer = combineReducers({
  account,
  accounts,
});

export default rootReducer;
