const mongoose = require('mongoose');

// const Schema = mongoose.Schema;
//const passportLocalMongoose = require('passport-local-mongoose');
const StatusSchema = new mongoose.Schema({
    // statusID:{
    //   type: String,
  
    // }
    textStatus: {
      type: String,
      required: false,
    },
    mediaStatus: { // include image and gif
      type: Buffer,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    creationTime: {
      type: Date,
      required: true,
    },
    viewedPeople:{
        type: Array,
        required: false,
    }
  });

  //StatusSchema.plugin(passportLocalMongoose);


// const User = mongoose.model('User', UserSchema);
const Status = mongoose.model("Status", StatusSchema);

module.exports = Status;