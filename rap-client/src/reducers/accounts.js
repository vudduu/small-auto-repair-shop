/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

const defaultAccountsState = {
  accountsListLoading: false,
  accountsList: [],
};

export default function (state = defaultAccountsState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}
