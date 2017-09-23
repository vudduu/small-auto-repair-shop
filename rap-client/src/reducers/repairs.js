/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import {
  CREATE_REPAIR,
} from '../constants';

const defaultRepairsState = {
  repairsListLoading: false,
  repairsList: [],
};

// function setRepairsListLoading(state, action) {
//   return Object.assign({}, state, {
//     repairsListLoading: action.value,
//   });
// }
//
// function existsOnList(list, item) {
//   return list.reduce((flag, aux) => (
//     flag || item._id === aux._id
//   ), false);
// }

function handleCreateRepair(state, action) {
  const repairsList = [...state.repairsList, {
    _id: action._id,
    complete: action.complete,
    comments: action.comments,
    date: action.date,
    hours: action.hours,
    owner: action.owner,
  }];
  return { ...state, repairsList };
}

export default function (state = defaultRepairsState, action = {}) {
  switch (action.type) {
    case CREATE_REPAIR:
      return handleCreateRepair(state, action);
    default:
      return state;
  }
}
