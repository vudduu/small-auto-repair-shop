const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Repair Schema
 */
var repairSchema = Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  date: { type: Date, required: true },
  hours: { type: Number, default: 0 },
  completeRole: { type: Number, default: 1 },
  complete: { type: Number, default: 0 },
  vehicle: { type: String, default: '' },
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'Account' },
    text: String,
    date: Date,
  }]
});

module.exports = mongoose.model('Repair', repairSchema);
