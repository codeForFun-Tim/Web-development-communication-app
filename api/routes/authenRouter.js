/* eslint-disable prefer-destructuring */
const bcrypt = require('bcryptjs');
const express = require('express');
const fs = require('fs');
const path = require('path');
const User = require('../model/user');
const passportLocalMongoose = require('passport-local-mongoose');
const { passport } = require('../app');
const { parser } = require('../app');
const { ObjectId } = require('mongoose').Types;
const { checkAuthenticated } = require('../app');
const { checkNotAuthenticated } = require('../app');
const { sendDatabaseErrorResponse } = require('../app');
const {
  checkAndSanitizeInput,
  handleInputCheck,
  checkFileSize,
  maxFileKb
} = require('../app');
const { Strategy } = require('passport');

const router = express.Router();

router.post('/Register', 
  checkNotAuthenticated,
  checkAndSanitizeInput(),
  handleInputCheck,
  async (req, res) => {
    const  email  = req.body.email;
    const  username  = req.body.username;
    const password  = req.body.password;
    const registrationDate = Date.now();
   

    try {
      // console.log(2);
      const hashedPassword = await bcrypt.hash(password, 10);
      let image = fs.readFileSync(path.join(__dirname, '../images/default-user-image.png'));
      User.findOne({ email })
        .then((userFoundByEmail) => {
          if (userFoundByEmail) {
            res.status(409);
            res.json(`[!] Email address is already in use: ${email}`);
          } else {
            User.findOne({ username })
              .then((userFoundByUsername) => {
                if (userFoundByUsername) {
                  res.status(409);
                  res.json(`[!] Username is already in use: ${username}`);
                } 
                else {                 
                  const newUser = new User({
                    email,
                    username,
                    password: hashedPassword,
                    registration_date:registrationDate,
                    image,
                    lockout: { attempts: 0, lastFailedDatetime: -1 },

                  });
                  newUser.save()
                    .then(() => res.sendStatus(201))
                    .catch((err) => sendDatabaseErrorResponse(err, res));
                }
              });
          }
        });
    } catch (err) {
      // console.log(4);
      res.status(559).json(`[!] Could not register user: ${err}`);
    }
  });


router.post('/login',
  checkNotAuthenticated,
  passport.authenticate('local'),
  (req, res) => {
    //console.log(1);
    res.sendStatus(200);
  },
  (req, res) => {
    //console.log(2);
    res.status(401);
    res.json('[!] Invalid credentials');
  });

router.post('/changePassword', 
   function(req, res) {
    User.findOne({ email: req.body.email }, async (err, user) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          //res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
          res.sendStatus(422);
        } else {
          const hashNewPass = await bcrypt.hash(req.body.newPassword, 10);
         
          // don't try to hash password here; instead, just read the password from the frontend (hashed old password)
          user.password = hashNewPass;
          user.save()
          .then(() => 
            {
              console.log('successful');
              res.json({ success: true, message: 'successful' });
            })
          .catch((e) => 
            {
              console.log(e);
              res.json({ success: false, message: 'failed' });
            });
        }
      }
  });   
});


router.post('/logout', 
  (req, res) => {
  req.logout();
  res.sendStatus(200);
});

router.get('/checkAuthen', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;