const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // on works for save and create
      validator: function (el) {
        return el === this.password;
      },
      message: 'password doesnot match',
    },
  },
});

userSchema.pre('save', async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // deleting the paswordconfirm field
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
