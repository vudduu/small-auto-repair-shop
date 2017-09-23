import {
  CREATE_REPAIR,
  UPDATE_REPAIR,
} from '../constants';

import { client } from '../api';

export function repairCreate(userId, date, hours) {
  return dispatch => (
    client.repairCreate(userId, date, hours)
      .then((res) => {
        dispatch({
          type: CREATE_REPAIR,
          ...res,
        });
        return res;
      })
  );
}

export function repairUpdate(repairId, userId, date, hours, complete) {
  return dispatch => (
    client.repairUpdate(repairId, userId, date, hours, complete)
      .then((res) => {
        dispatch({
          type: UPDATE_REPAIR,
          ...res,
        });
        return res;
      })
  );
}
