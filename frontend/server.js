/**
 * @file Main entry point for front end server.  Starts Express server and mindsbinds Next.js into all paths.
 * @module server
 */
const express = require('express');
// var cookieParser = require('cookie-parser');
const passport = require('passport');
const { Strategy } = require('passport-custom');

passport.use(new Strategy(function (req, done) {
  return done(null, { id: "auser", name: "Logged In User"} );
}));
passport.serializeUser(function(user, cb) {
  // console.log(`serializeUser: ${JSON.stringify(user)}`);
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  // console.log(`deserializeUser: ${JSON.stringify(id)}`);
  cb(null, { id: "auser", name: "Logged In User"});
});

const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handleNextJsRequest = app.getRequestHandler();

/**
 * Creates the Express server and sets up any needed routes before starting the server.
 */
function configureExpress() {
  const server = express();

  // server.use(bodyParser.json());
  // server.use(bodyParser.urlencoded({ extended: false }));
  // server.use(cookieParser());
  server.use(require('express-session')({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false
  }));
  server.use(passport.initialize());
  server.use(passport.session());
  server.get('/login',
    passport.authenticate('custom', { successRedirect: '/', failureRedirect: '/_error' } )
  );

  // server.get('/login', cas.authenticate(passport));
  server.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // server.get('/mgt/health', status.health());

  server.all('*', (req, res) => handleNextJsRequest(req, res));

  server.listen(process.env.FRONTEND_PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${process.env.FRONTEND_URL}`);
  });
}

app.prepare()
  .then(configureExpress)
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
