/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const express = require('express');
const { check, sanitize, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('c')(session);
const User = require('./model/user');
require('dotenv').config();

/**
 * MongoDB initialization.
 */
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(`[!] Could not connect to MongoDB Atlas: ${err}`);
  } else {
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB Atlas');
  }
});


/**
 * Passport initialization.
 */
const strategy = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

  let success = false;
  let message = '';

  User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        success = false;
        message = 'No user with that email';
        return done(null, false, { message });
      }

        bcrypt.compare(password, user.password, (bcryptErr, same) => {
          if (same) {
            // The user provided the correct password.
            success = true;
          } else {

            success = false;
          }
        });
    })
    .catch((err) => done(err));
});

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Functions used to protect routes based on authentication status.
 */
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json('[!] Not authorized');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(200);
  }

  return next();
}

/**
 * Settings for input validation and sanitization.
 */
function checkAndSanitizeInput() {
  return [
    check('email')
      .optional()
      .isEmail()
      .isLength({ min: 1, max: 32 }),
    check('username')
      .optional()
      .isLength({ min: 1, max: 32 })
      .trim()
      .escape(),
    check('password')
      .optional()
      .isLength({ min: 1, max: 256 })
      .trim()
      .escape(),
  
    sanitize('email'),
    sanitize('password'),
    sanitize('username'),
  ];
}

function handleInputCheck(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const err = errors.array()[0];
  return res.status(422).json(`[!] ${err.param}: ${err.msg}`);
}


function sendDatabaseErrorResponse(res, err) {
  res.status(550).json(`[!] Database error: ${err}`);
}

/**
 * Express initialization.
 */
const expressApp = express();

expressApp.enable('trust proxy');
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(logger('dev'));
expressApp.use(flash());
expressApp.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),

  resave: false,
  saveUninitialized: false,
}));
expressApp.use(express.json());
expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use(passport.initialize());
expressApp.use(passport.session());
expressApp.use(methodOverride('_method'));
expressApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// The routes depend on these exports, so export them first.
module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAndSanitizeInput,
  handleInputCheck,
  expressApp,
  mongoose,
  passport,
  sendDatabaseErrorResponse,
};

expressApp.use(require('./routes/authenRouter'));
