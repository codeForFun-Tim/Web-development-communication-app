/*
  Schema for the registration and login
  Will have more features in future
*/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// const User = new Schema({});

const LockoutSchema = new mongoose.Schema({
  attempts: {
    type: Number,
    required: true,
  },
  lastFailedDatetime: {
    type: Number,
    required: true,
  },
});

// const StatusSchema = new mongoose.Schema({
//   // statusID:{
//   //   type: String,

//   // }
//   textStatus: {
//     type: String,
//     required: false,
//   },
//   mediaStatus: { // include image and gif
//     type: Buffer,
//     required: false,
//   },
//   type: {
//     type: String,
//     required: true,
//   },
//   creationTime: {
//     type: Date,
//     required: true,
//   },
//   viewed: {
//     type: Date,
//     required: true,
//   }
// });


const UserSchema = new Schema({
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
  },

  status_list:{
    type: Array, // status id
    required: false,
  },
  
  lockout: {
    type: LockoutSchema,
    required: true,
  }
});

UserSchema.plugin(passportLocalMongoose);


// const User = mongoose.model('User', UserSchema);

module.exports = mongoose.model("User", UserSchema); ;
