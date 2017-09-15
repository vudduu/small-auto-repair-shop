const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Account Schema
 */
const accountSchema = Schema({
  username: { type: String, required: true, unique: true }, // pk
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },

  /**
   * TODO: add static: Account.roles.user
   * {
     *      1: visitor,
     *      2: regular,
     *      3: manager,
     *      4: admin,
     *      5: super user
     * }
   */
  role: { type: Number, default: 2 },
  enabled: { type: Number, default: 1 }
});

module.exports = mongoose.model('Account', accountSchema);
