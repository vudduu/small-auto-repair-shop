module.exports = {
  localUrl: 'http://127.0.0.1:3001',
  domain: 'http://localhost:3001',
  port: '3001',

  database: {
    // private
    protocol: 'mongodb://',
    user: 'admin',
    password: '', // TODO: remove from git repo
    applicationDb: 'react-academy-project',
    // public
    local: 'localhost',
    external: 'localhost'
  }
};
