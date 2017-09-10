const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const url = require('url');
const passport = require('passport');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/forge';

// ---------- Connect to database ---------------
mongoose.connect(dbURL, (error) => {
  if (error) {
    console.log('Could not connect to database');
    throw error;  // TODO: May want to do something more intelligent here
  }
});

// ---------- Hook up Redis ---------------------
// Port 6379 is the redis default
let redisURL = {
  hostname: 'localhost',
  port: 6379,
};

let redisPassword;

// This is fairly specific to Heroku
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPassword = redisURL.auth.split(':')[1];
}

// ---------- Configure passport ----------
// Could (probably should) also put all this in its own file
const User = require('./models/UserModel.js');

// Tell passport to use the local (username & password) auth strategy
passport.use(User.UserModel.createStrategy());

// Passport needs these to manage authentication across requests
passport.serializeUser(User.UserModel.serializeUser());
passport.deserializeUser(User.UserModel.deserializeUser());

// ---------- Setup express & router ------------
const app = express();
app.use(express.static(path.resolve(`${__dirname}/../hosted/`))); // static client files
app.disable('x-powered-by');  // disable the x-powered-by header so we don't leak our architecture
app.use(compression());       // To reduce size of messages we send to client
// Parse only urlencoded bodies and populate req.body
app.use(bodyParser.json()); // Needed for AJAX libs like superagent and axios
app.use(bodyParser.urlencoded({
  extended: true,             // Parse using the qs library
}));
app.use(cookieParser());
app.use(session({
  key: 'sessionid',           // Name of cookie
  store: new redisStore({     // Use Redis as our memory store for session
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPassword,
  }),
  secret: 'Cool tapes',       // TODO: Look into rotating secrets
  resave: true,               // Refresh key to keep it active - may have repercussions in production
  saveUninitialized: true,
  cookie: {
    httpOnly: true,           // Disallow JS access to cookies
                              // TODO: look into maxAge & secure properties
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// ---------- Allow CORS ------------------------
const middleware = require('./middleware/');
app.use(middleware.allowCORS);

// ---------- Set up router ---------------------
const router = require('./router.js');

router(app);


// ---------- Start listening for requests ------
app.listen(port, (error) => {
  if (error) {
    throw error;  // TODO: May want to do something more intelligent here
  }

  console.log(`Listening on port ${port}`);
});