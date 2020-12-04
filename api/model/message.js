const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

    message_ID:{ 
        type: String,
        required: true,
    },

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

    from: { //user id (sender)
        type: String,
        required: true,
    },

    to: { //user id (receiver) 
        type: String,
        required: true,
    }


    // audio message  audio/mpeg
    // video message  video/mp4
    // image .png, .jpg

});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;