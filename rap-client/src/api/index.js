import request from 'request';

export const baseURI = 'http://127.0.0.1:3001';

class ClientAPI {
  login(username, password) {
    return new Promise((resolve, reject) => {
      const options = {
        url: `${baseURI}/api/login`,
        method: 'POST',
        headers: {
          Accept: '*/*',
        },
        body: { username, password },
        json: true,
        timeout: 5000,
      };

      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        } else if (response.statusCode === 200) {
          this.username = username;
          resolve(body);
        } else {
          reject(response);
        }
      });
    });
  }

  registerAccount(username, password) {
    console.log(username, password);
  }
}

export const client = new ClientAPI();
