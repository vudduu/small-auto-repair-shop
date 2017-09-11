const colors = require('colors');
const config = require('./config').database;
const mongoose = require('mongoose');

module.exports = {

  // connection: null,
  db: null,

  getHost() {
    return process.env.NODE_ENV === 'production' ? config.external : config.local;
  },

  getDBName(db) {
    return config.protocol + this.getHost() + '/' + db;
  },

  getApplicationDB() {
    return this.getDBName(config.applicationDb);
  },

  initialize() {
    const me = this;
    // Start DB
    try {
      const promise = mongoose.connect(this.getApplicationDB(), {
        useMongoClient: true,
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: 30,
      });
      promise
        .then(db => {
          const message = '[DB] connected successfully to ' + me.getApplicationDB();
          console.log(message.green);
          this.db = db;
        })
        .catch(err => {
          const message = '[DB] database connection error:';
          console.log(message.red, err.message.red);
        });
    } catch (e) {
      console.warn('the mongoose module is not installed');
    }
  },

  getDB() {
    return this.db;
  }
};