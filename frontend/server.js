/**
 * @file Main entry point for front end server.  Starts Express server and mindsbinds Next.js into all paths.
 * @module server
 */
const express = require('express');
const next = require('next');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handleNextJsRequest = app.getRequestHandler();

const authMethod = dev ? 'custom' : 'somethingElse';
require(`./lib/auth-${authMethod}`).configure(passport);

// Signing secret for the token, must be shared by the backend server
const jwtSecret = process.env.JWT_SECRET;

/**
 * Creates the Express server and sets up any needed routes before starting the server.
 */
function configureExpress() {
  const server = express();
  // Set up local session management needed for passport
  server.use(require('express-session')({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false
  }));
  server.use(passport.initialize());
  server.use(passport.session());

  // Login module which creates the needed JWT token which can authN against the back end
  server.get('/login', (req, res, next) => {
    passport.authenticate(
      require(`./lib/auth-${authMethod}`).passportAuthMethod,
      { failureRedirect: '/_error' },
      // eslint-disable-next-line no-unused-vars
      (err, user, info) => {
        // eslint-disable-next-line no-unused-vars
        req.logIn(user, (err) => {
          const token = jwt.sign({}, jwtSecret,
            { expiresIn: '8h',
              algorithm: 'HS384',
              subject: req.user.id,
              issuer: `${process.env.APP_NAME}-${process.env.INSTANCE_ID}` });
          res.cookie('apiAuthToken', token);
          res.redirect('/');
        });
      })(req, res, next);
  });

  // disconnect the login session and kill the cookie
  server.get('/logout', (req, res) => {
    res.cookie('apiAuthToken', '', {maxAge: -1});
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
