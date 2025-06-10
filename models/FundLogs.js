const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  logMessage: { type: String, required: true },
  timestamp: { type: String, required: true }, // Store BigInt as string
  signature: { type: String, required: true },
}, { _id: false });

const fundLogsSchema = new mongoose.Schema({
  fund: { type: String, required: true, unique: true },
  name: { type: String }, // optional: fund name for display
  logs: { type: [logSchema], default: [] },
});

module.exports = mongoose.model('FundLogs', fundLogsSchema, 'fundss');
