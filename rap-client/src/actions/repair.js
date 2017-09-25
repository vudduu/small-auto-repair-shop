import {
  CREATE_REPAIR,
  UPDATE_REPAIR,
  DELETE_REPAIR,
  LOAD_REPAIRS,
  LOAD_REPAIR,
  LOAD_REPAIRS_LOADING,
  ADD_COMMENT,
} from '../constants';

import { client } from '../api';

export function repairCreate(userId, date, hours, vehicle) {
  return dispatch => (
    client.repairCreate(userId, date, hours, vehicle)
      .then((res) => {
        if (res.success) {
          dispatch({ type: CREATE_REPAIR, ...res });
        }
        return res;
      })
  );
}

export function repairUpdate(repairId, userId, date, hours, complete, vehicle, completeRole) {
  const repair = {
    _id: repairId,
  };
  if (userId) repair.owner = userId;
  if (date) repair.date = date;
  if (hours) repair.hours = hours;
  if (complete) repair.complete = complete;
  if (vehicle) repair.vehicle = vehicle;
  if (completeRole) repair.completeRole = completeRole;
  return dispatch => (
    client.repairUpdate(repairId, userId, date, hours, complete, vehicle)
      .then((res) => {
        if (res.success) {
          dispatch({ type: UPDATE_REPAIR, ...repair });
        }
        return res;
      })
  );
}

export function getRepairsFromUserByDate(userId, from = new Date(), to = new Date()) {
  return (dispatch) => {
    dispatch({ type: LOAD_REPAIRS_LOADING, value: true });
    return client.getRepairsFromUserByDate(userId, from, to)
      .then((res) => {
        if (res.success) {
          dispatch({ type: LOAD_REPAIRS, ...res });
        }
        dispatch({ type: LOAD_REPAIRS_LOADING, value: false });
        return res;
      });
  };
}

export function loadRepairById(repairId) {
  return (dispatch) => {
    dispatch({ type: LOAD_REPAIRS_LOADING, value: true });
    return client.getRepairById(repairId)
      .then((res) => {
        if (res.success) {
          dispatch({ type: LOAD_REPAIR, ...res });
        }
        dispatch({ type: LOAD_REPAIRS_LOADING, value: false });
        return res;
      });
  };
}

export function loadRepairsByDate(date) {
  return (dispatch) => {
    dispatch({ type: LOAD_REPAIRS_LOADING, value: true });
    return client.getRepairsByDate(date)
      .then((res) => {
        if (res.success) {
          dispatch({ type: LOAD_REPAIRS, repair: res.repairs });
        }
        dispatch({ type: LOAD_REPAIRS_LOADING, value: false });
        return res;
      });
  };
}

export function deleteRepair(repairId) {
  return dispatch => (
    client.repairDelete(repairId)
      .then((res) => {
        if (res.success) {
          dispatch({ type: DELETE_REPAIR, repairId });
        }
        return res;
      })
  );
}

export function addCommentRepair(repairId, comment) {
  return dispatch => (
    client.addCommentRepair(repairId, comment)
      .then((res) => {
        if (res.success) {
          dispatch({ type: ADD_COMMENT, ...res });
        }
        return res;
      })
  );
}
