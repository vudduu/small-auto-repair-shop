/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import {
  CREATE_REPAIR,
  DELETE_REPAIR,
  LOAD_REPAIR,
  LOAD_REPAIRS,
  LOAD_REPAIRS_LOADING,
} from '../constants';

const defaultRepairsState = {
  repairsListLoading: false,
  repairsList: [],
};

function existsOnList(list, item) {
  return list.reduce((flag, aux) => (
    flag || item._id === aux._id
  ), false);
}

function handleCreateRepair(state, action) {
  const repairsList = [...state.repairsList, {
    _id: action._id,
    complete: action.complete,
    comments: action.comments,
    date: new Date(action.date),
    hours: action.hours,
    owner: action.owner,
  }];
  return { ...state, repairsList };
}

function handleDeleteRepair(state, action) {
  const repairsList = state.repairsList.filter(rep => (
    rep._id !== action.repairId
  ));
  return { ...state, repairsList };
}

function handleLoadRepairs(state, action) {
  const oldRepairsList = state.repairsList.filter(rep => !existsOnList(action.repair, rep));
  const newRepairs = action.repair.map(rep => (
    { ...rep, date: new Date(rep.date) }
  ));
  const repairsList = [...oldRepairsList, ...newRepairs].sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.hours - b.hours;
  });
  return { ...state, repairsList, repairsListLoading: false };
}

function handleLoadRepair(state, action) {
  let repairsList = state.repairsList;
  if (!existsOnList(state.repairsList, action)) {
    repairsList = [
      ...state.repairsList,
      { ...action, date: new Date(action.date) },
    ].sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return a.hours - b.hours;
    });
  }
  return { ...state, repairsList, repairsListLoading: false };
}

function handleLoadRepairsLoading(state, action) {
  const repairsListLoading = action.value;
  return { ...state, repairsListLoading };
}

export default function (state = defaultRepairsState, action = {}) {
  switch (action.type) {
    case CREATE_REPAIR:
      return handleCreateRepair(state, action);
    case DELETE_REPAIR:
      return handleDeleteRepair(state, action);
    case LOAD_REPAIR:
      return handleLoadRepair(state, action);
    case LOAD_REPAIRS:
      return handleLoadRepairs(state, action);
    case LOAD_REPAIRS_LOADING:
      return handleLoadRepairsLoading(state, action);
    default:
      return state;
  }
}
