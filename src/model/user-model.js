const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  kakaoId: { type: String, required: true, unique: true },
  nickname: String,
  email: String,
  profileImage: String,
  UserName: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
