/* eslint-disable prefer-destructuring */
const bcrypt = require('bcryptjs');
const express = require('express');
//const fs = require('fs');
const path = require('path');
const User = require('../model/user');
const { passport } = require('../app');
//const { parser } = require('../app');
const { checkAuthenticated } = require('../app');
const { checkNotAuthenticated } = require('../app');
const { sendDatabaseErrorResponse } = require('../app');
const {
  checkAndSanitizeInput,
  handleInputCheck,
} = require('../app');

const router = express.Router();

router.post('/Register', checkNotAuthenticated,
  checkAndSanitizeInput(),
  handleInputCheck,
  async (req, res) => {
    const { email } = req.body;
    const { password } = req.body;
    const { username } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

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

                  const newUser = new User({
                    email,
                    username,
                    password: hashedPassword,
                  });

                  newUser.save()
                    .then(() => res.sendStatus(201))
                    .catch((err) => sendDatabaseErrorResponse(err, res));
                }
              });
          }
        });
    } catch (err) {
      res.status(559).json(`[!] Could not register user: ${err}`);
    }
  });

router.post('/login',
  checkNotAuthenticated,
  passport.authenticate('local'),
  (req, res) => {
    res.sendStatus(200);
  },
  (req, res) => {
    res.status(401);
    res.json('[!] Invalid credentials');
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