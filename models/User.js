const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  backupQuestion: { type: String, required: true },
  backupQuestionAns: { type: String, required: true },
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
