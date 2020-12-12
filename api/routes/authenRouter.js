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
    // console.log(1);
    //console.log("req body: ",req.body);
    const  email  = req.body.email;
    const  username  = req.body.username;
    const password  = req.body.password;
    const registrationDate = Date.now();
    /**
    if (file && !checkFileSize(file)) {
      res.status(413);
      res.json(`[!] Profile picture is too large (max = ${maxFileKb}KB)`);
      return;
    }

    if (file && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      res.status(422);
      res.json('[!] Invalid file type (only PNG or JPEG allowed)');
      return;
    }
    */

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
                } else {
                  /**
                  if (file) {
                    let bytes;

                    try {
                      const img = fs.readFileSync(file.path);
                      bytes = img.toString('base64');
                      fs.unlinkSync(file.path);
                    } catch (err) {
                      res.status(551);
                      res.json(`[!] Could not read profile picture: ${err}`);
                      return;
                    }

                    if (bytes) {
                      image = Buffer.from(bytes, 'base64');
                    }
                  }
                  */
                  // console.log(3);
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
// TODO : return a cookie OR JSON webtoken (get from the frontend )
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

// router.put('/changePassword',
// //   checkNotAuthenticated,
//   // passport.authenticate('local'),
//   // async (req,res) => {
//   //   console.log(0);
//   //   const email = req.body.email;
//   //   const newPassword  = req.body.newPassword;
//   //   console.log(email, newPassword);
//   //   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   //   User.findByUsername(email).then(function(sanitizedUser){
//   //     if (sanitizedUser){
//   //         sanitizedUser.setPassword(hashedPassword, function(){
//   //             sanitizedUser.save();
//   //             res.status(200).json({message: 'password reset successful'});
//   //         });
//   //     } else {
//   //         res.status(500).json({message: 'This user does not exist'});
//   //     }
//   // },function(err){
//   //     console.error(err);
//   // })
//   // }
//   User.findOne({ _id: req.body._id },(err, user) => {
//     // Check if error connecting
//     if (err) {
//       res.json({ success: false, message: err }); // Return error
//     } else {
//       // Check if user was found in database
//       if (!user) {
//         res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
//       } else {
//         user.changePassword(req.body.oldPassword, req.body.newPassword, function(err) {
//            if(err) {
//                     if(err.name === 'IncorrectPasswordError'){
//                          res.json({ success: false, message: 'Incorrect password' }); // Return error
//                     }else {
//                         res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
//                     }
//           } else {
//             res.json({ success: true, message: 'Your password has been changed successfully' });
//            }
//          })
//       }
//     }
//   });

router.post('/changePassword', 
   function(req, res) {

    User.findOne({ _id: ObjectId(req.body._id) }, async (err, user) => {
      console.log(user);
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
        } else {
          // console.log('old pass: ', req.body.oldPassword);
          // console.log('new pass: ', req.body.newPassword);
          // const hashOldPass = await bcrypt.hash(req.body.oldPassword, 10);
          const hashNewPass = await bcrypt.hash(req.body.newPassword, 10);
          // console.log('hasn old pass: ', hashOldPass);
          // console.log('hash new pass: ', hashNewPass);

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

          // user.setPassword(req.body.newPassword, function(err, user){
          //   console.log('change password', req.body.newPassword);
          // // const match = await bcrypt.compare(req.body.oldPassword, hashed password from database);
          //   if(err) {
          //     console.log('err message: ',err);
          //             if(err.name === 'IncorrectPasswordError'){
          //                 res.json({ success: false, message: 'Incorrect password' }); // Return error
          //             }else {
          //                 res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
          //             }
          //   } else {
          //     console.log('password changed!');
          //     res.json({ success: true, message: 'Your password has been changed successfully' });
          //   }
          // })
        }
      }
  });   
});

router.post('/logout', checkAuthenticated, (req, res) => {
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