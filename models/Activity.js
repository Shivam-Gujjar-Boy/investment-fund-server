const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  type: { type: String, required: true },
  user: { type: String },               // optional depending on type
  fund: { type: String },               // optional if embedded in log
  proposalId: { type: String },         // for proposal-related events
  tokenMint: { type: String },
  amount: { type: Number },
  timestamp: { type: Date, default: Date.now },
  signature: { type: String },          // Solana TX sig
});

module.exports = mongoose.model("Activity", ActivitySchema);
