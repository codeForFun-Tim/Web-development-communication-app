/* eslint-disable no-underscore-dangle */
const express = require('express');
const fs = require('fs');
const { ObjectId } = require('mongoose').Types;
const User = require('../model/user');
const Message = require('../model/message');
const { parser } = require('../app');
const { checkAuthenticated } = require('../app');
const { sendDatabaseErrorResponse } = require('../app');
const {
  checkAndSanitizeInput,
  handleInputCheck,
  checkFileSize,
  maxFileKb,
} = require('../app');

const router = express.Router();

router.post('/send',
  checkAuthenticated,
  checkAndSanitizeInput(),
  handleInputCheck,
  (req, res) => {

    //message_id, message_type, time stamp, text_message_content,from, to

    // send request from frontend (text_message_content, from, to, message_type)
    // const {message_id} = 
    const {text} = req.body.text_message_content;
    const {messageType} = req.message_type;
    const {sender} = req.from;
    const {receiver} = req.to;
    const {time} = Date.now().toString();



    // const { username } = req.user;
    // const { title } = req.body;
    // const { description } = req.body;
    // const { privacy } = req.body;
    // let { tags } = req.body;
    // const { file } = req;

    // if (!file) {
    //   res.status(422);
    //   res.json('[!] Image must be provided when making a post');
    //   return;
    // }

    // const contentType = file.mimetype;

    // TODO: Set the message type for text, audio, and video 

    if (messageType !== 'text/plain' && messageType !== 'text/html') {
      res.status(422);
      res.json('For now only text message is allowed');
      return;
    }

    try {
      if (file && !checkFileSize(file)) {
        res.status(413);
        res.json(`[!] Image is too large (max = ${maxFileKb}KB)`);
        return;
      }

      image = fs.readFileSync(file.path).toString('base64');
      fs.unlinkSync(file.path);
    } catch (err) {
      res.status(551).json(`[!] Could not read image: ${err}`);
      return;
    }

    image = Buffer.from(image, 'base64');
    const datetime = Date.now().toString();

    tags = tags.split(/[, ]+/);
    const validatedTags = new Set();

    User.find() 
      .then((userArray) => {
        const userSet = new Set();

        userArray.forEach((user) => {
          userSet.add(user.username);
        });

        tags.forEach((tag) => {
          if (userSet.has(tag)) {
            validatedTags.add(tag);
          }
        });

        const newPost = new Post({
          username,
          datetime,
          image,
          contentType,
          title,
          description,
          privacy,
          likes: [],
          tags: Array.from(validatedTags),
          comments: [],
        });

        newPost.save()
          .then((post) => {
            User.findOneAndUpdate(
              { username },
              { $push: { posts: { id: post._id, time: post.datetime } } },
            )
              .then(() => {
                res.sendStatus(201);
              })
              .catch((err) => sendDatabaseErrorResponse(err, res));
          })
          .catch((err) => sendDatabaseErrorResponse(err, res));
      });
  });
