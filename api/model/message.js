const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

    // message_ID:{                           
    //     type: String,
    //     required: true,
    // },

    // _ID


    message_type: {
        type: String,
        required: true,
    },

    timeStamp: {
        type: Date,
        required: true,
    },

    text_message_content:{
        type: String, //text/html
        required: false,
    },

    media_message_content:{ // contain image, audio, and video 
        type: Buffer,
        required: false,
    },

    from: { //user id (sender)
        type: String,
        required: true,
    },

    to: { //user id (receiver) 
        type: String,
        required: true,
    }

});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;