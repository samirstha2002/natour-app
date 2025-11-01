const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    // maxlength: [20, 'user must have  name length less or equal to 20 letters'],
    // minlength: [
    //   10,
    //   'user must have name length greater or equalt to 10 letters',
    // ],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please validate your email'],
  },
  photo: String,

  password: {
    type: String,
    required: [true, 'Please provide  the password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});
const User = mongoose.model('User', userSchema);
module.exports = User;
