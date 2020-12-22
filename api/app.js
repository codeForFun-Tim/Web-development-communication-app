/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const express = require('express');
const { check, sanitize, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const User = require('./model/user');
const Message = require('./model/message');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const multer = require('multer');

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
 * Multer initialization.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const a = file.originalname.split('.');
    cb(null, `${file.fieldname}-${Date.now()}.${a[a.length - 1]}`);
  },
});

const parser = multer({ storage });

/**
 * Passport initialization.
 */
const strategy = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

  // Lockout settings.
  const attemptsToLockout = 3;
  // 2 minutes in milliseconds.
  const msToLockout = 2 * 60 * 1000;
  // 1 hour (now just 1 minute for testing) in milliseconds.
  // 1 * 60 * 
  const msOfLockout = 1 * 60 * 1000;
  let lockedOut = false;

  let success = false;
  let message = '';

  User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      // console.log("email: ",email);
      if (!user) {
        // console.log("inside the user");
        success = false;
        message = 'No user with that email';
        return done(null, false, { message });
      }

      let { attempts } = user.lockout;
      // If lastFailedDatetime < 0, there is no recorded login failure.
      let { lastFailedDatetime } = user.lockout;

      // Check if the user failed too many login attempts.
      if (attempts >= attemptsToLockout) {
        // Check if the user's login failures happened recently.
        if (lastFailedDatetime < 0 || lastFailedDatetime + msOfLockout > Date.now()) {
          // The user's login failures happened recently.
          // They are locked out.
          lockedOut = true;
          success = false;
          message = 'Account is locked out';
          return done(null, false, { message });
        }

        // The user was locked out previously, but enough time elapsed to unlock the account.
        lockedOut = false;
        attempts = 0;
        lastFailedDatetime = -1;
      }
      if(!lockedOut){
        bcrypt.compare(password, user.password, (bcryptErr, same) => {
          if (same) {
            // The user provided the correct password.
            // console.log("same if");
            success = true;
            message = 'success';
            return done(null, user, {message});
          } else {
            // console.log("same else");
            if (lastFailedDatetime > 0 && lastFailedDatetime + msToLockout > Date.now()) {
              // The user's last login failure happened recently.
              attempts += 1;
              lastFailedDatetime = Date.now();
            } else {
              // The user's last login failure did not happen recently.
              attempts = 1;
              lastFailedDatetime = Date.now();
            }

            success = false;

            // success = false;
            // message = 'Recheck your password';
            // return done(null,false, {message});
          }
           // Update the user's lockout status.
           User.findOneAndUpdate(
            { email },
            { $set: { 'lockout.attempts': attempts, 'lockout.lastFailedDatetime': lastFailedDatetime } },
            { new: true },
          )
            .then(() => {
              if (success) {
                return done(null, user);
              }

              return done(null, false, { message });
            })
            .catch((err) => done(err));

        });
      }
    })
    .catch((err) => done(err));
  // }
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
 * TODO: add cookies 
 */
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    //console.log('if req in checkAuth',req);
    //console.log('if res in checkAuth',res);
    //console.log('if next in checkAuth',next);
    return next();
  }
  //console.log('el req in checkAuth',req);
  // console.log('el res in checkAuth',res);
  // console.log('el next in checkAuth',next);
  return res.status(401).json('[!] Not authorized');
}

function checkNotAuthenticated(req, res, next) {
  console.log("checkNotAuthenticated");
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
expressApp.use(cors()); // replace webapp with your express app

const port = process.env.PORT || 8080;

// Start server
expressApp.listen(port, () => {
  console.log(`Server running on port:${port}`);
});


// expressApp.enable('trust proxy');
// expressApp.use(bodyParser.json());
// expressApp.use(bodyParser.urlencoded({ extended: true }));
// expressApp.use(express.urlencoded({ extended: false }));
// expressApp.use(logger('dev'));
// expressApp.use(flash());
// expressApp.use(session({
//   secret: process.env.SESSION_SECRET,
//   store: new MongoStore({ mongooseConnection: mongoose.connection }),
//   resave: false,
//   saveUninitialized: false,
// }));
// expressApp.use(express.json());
// expressApp.use(express.static(path.join(__dirname, 'public')));
// expressApp.use(passport.initialize());
// expressApp.use(passport.session());
// expressApp.use(methodOverride('_method'));
// expressApp.use((req, res, next) => {
//   // res.header('Access-Control-Allow-Origin', 'https://photogram-front.herokuapp.com');
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });


expressApp.use(fileUpload()); 
expressApp.enable('trust proxy');
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(logger('dev'));
expressApp.use(flash());
expressApp.use(express.static('public')); // for serving the HTML file

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
  //res.header('Access-Control-Allow-Origin', 'https://excellent-web-app.herokuapp.com');
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
  parser,
  sendDatabaseErrorResponse,
};

expressApp.use(require('./routes/authenRouter'));
expressApp.use(require('./routes/messageRouter'));
expressApp.use(require('./routes/videoCallRouter'));
expressApp.use(require('./routes/contact'));
expressApp.use(require('./routes/status'));
