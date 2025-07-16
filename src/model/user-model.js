const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  kakaoId: { type: String, required: true, unique: true },
  nickname: String,
  email: String,
  profileImage: String,
  userName: { type: String, unique: true },
  introduction: String,
  link: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
