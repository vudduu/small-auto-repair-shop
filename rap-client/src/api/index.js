export const baseURI = 'http://127.0.0.1:3001';

const defaultHeaders = new window.Headers({
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/json',
});

const optionsDefault = {
  method: 'get',
  headers: defaultHeaders,
  mode: 'cors',
  cache: 'default',
  credentials: 'include',
};

const requestPromised = (url, options) => (
  window.fetch(url, options).then(o => o.json())
);

class ClientAPI {
  constructor() {
    this.username = null;
  }

  login(username, password) {
    const options = {
      ...optionsDefault,
      method: 'post',
      body: JSON.stringify({ username, password }),
    };
    return requestPromised(`${baseURI}/api/login`, options).then((res) => {
      this.username = username;
      return res;
    });
  }

  logout() {
    const options = {
      ...optionsDefault,
    };
    return requestPromised(`${baseURI}/api/logout`, options).then((res) => {
      this.username = null;
      return res;
    });
  }

  getAuth() {
    const options = {
      ...optionsDefault,
    };
    return requestPromised(`${baseURI}/api/account/get-auth`, options);
  }

  registerAccount(username, password, name, email, role) {
    const options = {
      ...optionsDefault,
      method: 'post',
      body: JSON.stringify({ username, password, name, email, role }),
    };
    return requestPromised(`${baseURI}/api/account/create`, options);
  }

  updateAccount(accountId, data) {
    const options = {
      ...optionsDefault,
      method: 'put',
      body: JSON.stringify(data),
    };
    return requestPromised(`${baseURI}/api/account/update/${accountId}`, options);
  }

  deleteAccount(accountId) {
    const options = {
      ...optionsDefault,
      method: 'delete',
    };
    return requestPromised(`${baseURI}/api/account/delete/${accountId}`, options);
  }

  getAccountsList(page) {
    const options = {
      ...optionsDefault,
    };
    return requestPromised(`${baseURI}/api/account/get-all?page=${page}`, options);
  }

  getAllAccountsIdsNames() {
    const options = {
      ...optionsDefault,
    };
    return requestPromised(`${baseURI}/api/account/get-all-ids`, options);
  }

  repairCreate(userId, date, hours, vehicle) {
    const options = {
      ...optionsDefault,
      method: 'post',
      body: JSON.stringify({ userId, date, hours, vehicle }),
    };
    return requestPromised(`${baseURI}/api/repair/create`, options);
  }

  repairUpdate(repairId, userId, date, hours, complete, vehicle) {
    const options = {
      ...optionsDefault,
      method: 'put',
      body: JSON.stringify({ userId, date, hours, complete, vehicle }),
    };
    return requestPromised(`${baseURI}/api/repair/update/${repairId}`, options);
  }

  repairDelete(repairId) {
    const options = {
      ...optionsDefault,
      method: 'delete',
    };
    return requestPromised(`${baseURI}/api/repair/delete/${repairId}`, options);
  }

  getRepairsFromUser(userId) {
    const options = {
      ...optionsDefault,
    };
    return requestPromised(
      `${baseURI}/api/repair/get-all-user?userId=${userId}`,
      options,
    );
  }

  getRepairsFromUserByDate(userId, from, to) {
    const options = {
      ...optionsDefault,
    };
    return requestPromised(
      `${baseURI}/api/repair/get-all-user-date?userId=${userId}&from=${from}&to=${to}`,
      options,
    );
  }

  addCommentRepair(repairId, comment) {
    const options = {
      ...optionsDefault,
      method: 'post',
      body: JSON.stringify({ comment }),
    };
    return requestPromised(`${baseURI}/api/repair/${repairId}/comment`, options);
  }

  getRepairById(repairId) {
    const options = {
      ...optionsDefault,
    };
    return requestPromised(`${baseURI}/api/repair/by-id/${repairId}`, options);
  }

  getRepairsByDate(date) {
    const options = {
      ...optionsDefault,
    };
    return requestPromised(`${baseURI}/api/repair/by-date?date=${date}`, options);
  }
}

export const client = new ClientAPI();
