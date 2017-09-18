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
}

export const client = new ClientAPI();
