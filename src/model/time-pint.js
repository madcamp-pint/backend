const mongoose = require('mongoose');

const timePintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  openDate: { type: Date, required: true },
  isPublic: { type: Boolean, default: true },
  tags: [{ type: String }],
  mediaUrl: { type: String },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TimePint', timePintSchema);