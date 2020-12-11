/* eslint-disable no-underscore-dangle */
const express = require('express');
const fs = require('fs');
const { ObjectId } = require('mongoose').Types;
const User = require('../model/user');
const Message = require('../model/message');
const Room = require('../model/room');
const { parser } = require('../app');
const multer = require('multer');
const { checkAuthenticated } = require('../app');
const { sendDatabaseErrorResponse } = require('../app');
const {
  checkAndSanitizeInput,
  handleInputCheck,
  checkFileSize,
  maxFileKb,
} = require('../app');

const router = express.Router();

// var upload = multer({ dest: __dirname + '/public/uploads/' });
// var type = upload.single('image');

// TODO: make sure what the response would be AND adding polling here 
router.get('/getMessageViaRoom',
   checkAuthenticated,
  function (req,res) {
    const roomID = req.body.roomID;
    const messageType = req.body.message_type;

    Room.findOne(
       {_id: roomID}, (err,room) =>{
        const messageID = room.messageList; 
        Message.findOne(
          {_id:messageID}, (err,message) =>{
            if(message.message_type ==='text'){
              const textMessage = message.text_message_content; // now message is a text
            }
            else if (message.message_type === 'audio/mpeg' ||
              message.message_type === 'video' ||
              message.message_type === 'iamge'){
                const mediaMessage = message.media_message_content
              }
          }
        )

        if(err) {logError(`there is no such a room`,err,response);}
      }

    )

  }


)

router.post('/sendMessage',//roomID from frontend, generated by MongoDB, 
//maintain the state which room we are in 
  //checkAuthenticated,
//   checkAndSanitizeInput(),
//   handleInputCheck,
  function (req, res){
    //message_id, message_type, time stamp, text_message_content,from, to
    // send request from frontend (text_message_content, from, to, message_type)
    const roomID = req.body.roomID;
    // const message_id = req.params;
    const text = req.body.text_message_content;
    const media_content = req.files.media_message_content;
    const messageType = req.body.message_type;
    const sender = req.body.from;
    const receiver = req.body.to;

    const time = Date.now().toString();
    // console.log('message_id',message_id);
    console.log(req.body);

    const newRoom = new Room({
      roomNum: roomID, 
      userList: [sender,receiver],
      messageList: []
    })
    
    if (messageType === 'text') {
        const newTextMessage = new Message ({
            // message_id,
            message_type: messageType,
            timeStamp : time,
            text_message_content: text,
            from: sender,
            to: receiver,
        });
        
        newTextMessage.save()
        .then((message) => {
            const messageId = message._id;
            console.log('messageId',messageId);
          Room.findOne(
            { $or: [{userList: [sender, receiver]}, {userList: [receiver, sender]} ]}, (err,room) =>{
              if(!room){
                room = newRoom;
                newRoom.save();
              }
              else{
                room.messageList.push(messageId);
                room.save();
              }
              if(err) {logError(`Cannot create a chat room`,err,response);}
              //done(err,room);
            } 
          // Room.findOneAndUpdate(
          //   { _id: ObjectId(roomID)}, // just get id for room schema
          //   { $push: { messageList: ObjectId(message._id) }}
          )
            .then(() => {
              res.sendStatus(201);
            })
            .catch((err) => sendDatabaseErrorResponse(err, res));
        })
        .catch((err) => console.log(err));
        // send text message, create message object, add it to the room (room number, list of users, array of messages) 
    }
    else if(messageType === 'audio/mpeg'){
      // let audio;
      console.log('media con',media_content);
      // audio = fs.readFileSync(media_content.path).



      const newAudioMessage = new Message ({
        message_type: messageType,
        timeStamp : time,
        media_message_content: media_content,
        from: sender,
        to: receiver,
    });
    console.log(newAudioMessage);
      // send audio message, blob (convert to binary, store to db)
      //audio = fs.readFileSync(media_content).toString('base64');
      // fs.unlinkSync(media_content);
      // here use GridFS to convert?


     
      
      newAudioMessage.save()
      .then((message) => {
          const messageId = message._id;
          console.log('messageId',messageId);
        Room.findOne(
          { $or: [{userList: [sender, receiver]}, {userList: [receiver, sender]} ]}, (err,room) =>{
            if(!room){
              room = newRoom;
              newRoom.save();
            }
            else{
              room.messageList.push(messageId);
              room.save();
            }
            if(err) {logError(`Cannot create a chat room`,err,response);}
            //done(err,room);
          } 
        // Room.findOneAndUpdate(
        //   { _id: ObjectId(roomID)}, // just get id for room schema
        //   { $push: { messageList: ObjectId(message._id) }}
        )
          .then(() => {
            res.sendStatus(201);
          })
          .catch((err) => sendDatabaseErrorResponse(err, res));
      })
      .catch((err) => console.log(err));
      // send text message, create message object, add it to the room (room number, list of users, array of messages) 
        
    }
    
    else if (messageType === 'video'){
        // send video message, blob 
        const newVideoMessage = new Message ({
          message_type: messageType,
          timeStamp : time,
          media_message_content: media_content,
          from: sender,
          to: receiver,
      });
      console.log(newVideoMessage);

      newVideoMessage.save()
      .then((message) => {
          const messageId = message._id;
          console.log('messageId',messageId);
        Room.findOne(
          { $or: [{userList: [sender, receiver]}, {userList: [receiver, sender]} ]}, (err,room) =>{
            if(!room){
              room = newRoom;
              newRoom.save();
            }
            else{
              room.messageList.push(messageId);
              room.save();
            }
            if(err) {logError(`Cannot create a chat room`,err,response);}
            //done(err,room);
          } 
        // Room.findOneAndUpdate(
        //   { _id: ObjectId(roomID)}, // just get id for room schema
        //   { $push: { messageList: ObjectId(message._id) }}
        )
          .then(() => {
            res.sendStatus(201);
          })
          .catch((err) => sendDatabaseErrorResponse(err, res));
      })
      .catch((err) => console.log(err));

    }
    else if (messageType === 'image'){
        // send the image to 
        // image = Buffer.from(image, 'base64');

        const newImageMessage = new Message ({
          message_type: messageType,
          timeStamp : time,
          media_message_content: media_content,
          from: sender,
          to: receiver,
      });
      console.log(newImageMessage);

      newImageMessage.save()
      .then((message) => {
          const messageId = message._id;
          console.log('messageId',messageId);
        Room.findOne(
          { $or: [{userList: [sender, receiver]}, {userList: [receiver, sender]} ]}, (err,room) =>{
            if(!room){
              room = newRoom;
              newRoom.save();
            }
            else{
              room.messageList.push(messageId);
              room.save();
            }
            if(err) {logError(`Cannot create a chat room`,err,response);}
            //done(err,room);
          } 
        // Room.findOneAndUpdate(
        //   { _id: ObjectId(roomID)}, // just get id for room schema
        //   { $push: { messageList: ObjectId(message._id) }}
        )
          .then(() => {
            res.sendStatus(201);
          })
          .catch((err) => sendDatabaseErrorResponse(err, res));
      })
      .catch((err) => console.log(err));

    }
    else {
        // message type is not correct
      res.status(422);
      res.json('Invalid file type.');
      return;
    }

    
  });
  module.exports = router;