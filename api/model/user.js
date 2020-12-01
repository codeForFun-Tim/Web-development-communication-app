/*
  Schema for the registration and login
  Will have more features in future
*/

const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  email: { // username
    type: String,
    required: true,
    unique: true,
  },
  username: { // nickname
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  registration_date: {
    type: Date,
    required: true,
  },
  image: { // profile image
    type: Buffer,
    required: false,
  },
  contact_list: {
    type: Array,
    required: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
