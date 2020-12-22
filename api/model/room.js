/*
This is for chat history: a user log in, then if he/she clicks on any person, the roomSchema will 
be triggered and all messages between logged-in user and the selected user should be displayed 
*/

// const User = require('../model/user');
// const Message = require('../model/message');

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({

    roomNum: { // primary key
       type: String,
       required: false,
    },

    userList: { //just two user (maybe email)
        type: Array,
        required: true
    },

    messageList: { // store each id (there could be multiple messages of different types)
        type: Array,
        required: true
    }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;