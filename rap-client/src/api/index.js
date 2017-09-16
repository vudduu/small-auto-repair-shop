import request from 'request';

export const baseURI = 'http://127.0.0.1:3001';

const optionsPostDefault = {
  method: 'GET',
  headers: {
    Accept: '*/*',
  },
  body: {},
  json: true,
  timeout: 5000,
};

const requestPromised = options => new Promise((resolve, reject) => {
  request(options, (error, response, body) => {
    if (error) {
      reject(error);
    } else if (response.statusCode === 200) {
      resolve(body);
    } else {
      reject(response);
    }
  });
});

class ClientAPI {
  constructor() {
    this.username = null;
  }

  login(username, password) {
    const options = {
      ...optionsPostDefault,
      url: `${baseURI}/api/login`,
      method: 'POST',
      body: { username, password },
    };
    return requestPromised(options).then((res) => {
      this.username = username;
      return res;
    });
  }

  registerAccount(username, password, name, email, role) {
    const options = {
      ...optionsPostDefault,
      url: `${baseURI}/api/account/create`,
      method: 'POST',
      body: { username, password, name, email, role },
    };
    return requestPromised(options);
  }
}

export const client = new ClientAPI();
