import { combineReducers } from 'redux';

import account from './account';
import accounts from './accounts';
import repairs from './repairs';

const rootReducer = combineReducers({
  account,
  accounts,
  repairs,
});

export default rootReducer;
