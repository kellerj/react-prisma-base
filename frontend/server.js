/**
 * @file Main entry point for front end server.  Starts Express server and mindsbinds Next.js into all paths.
 * @module server
 */
const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const getConfig = require('next/config').default;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');

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
  // Needed only to parse the CSP report.
  server.use(bodyParser.json({
    type: ['json', 'application/csp-report']
  }));
  // Set up rules which prevent embedding of the application into other sites
  // and disallow the page from contacting sites other than itself and the backend server
  const { backendUrl } = getConfig().publicRuntimeConfig;
  server.use(helmet({
    contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ['*'],
          objectSrc: ["'none'"],
          mediaSrc: ["'none'"],
          frameSrc: ["'none'"],
          connectSrc: ["'self'", backendUrl],
          reportUri: '/csp-violation',
        },
        reportOnly: false,//process.env.NODE_ENV === 'development',
    },
    frameguard: {
      action: 'deny',
    }
  }));
  // Set up local session management needed for passport
  server.use(require('express-session')({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: process.env.SESSION_EXPIRE_HOURS * 60 * 60 * 1000},
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
            { expiresIn: process.env.SESSION_EXPIRE_HOURS + 'h',
              algorithm: 'HS384',
              subject: req.user.id,
              issuer: `${process.env.APP_NAME}-${process.env.INSTANCE_ID}` });
          res.cookie('apiAuthToken', token, { maxAge: process.env.SESSION_EXPIRE_HOURS * 60 * 60 * 1000});
          res.redirect('/');
        });
      })(req, res, next);
  });

  // disconnect the login session and kill the cookie
  server.get('/logout', (req, res) => {
    res.cookie('apiAuthToken', '', {maxAge: -1});
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });

  // Log any instances of the CSP rules being violated
  server.post('/csp-violation', (req, res) => {
    if (req.body) {
      console.log('CSP Violation: ', req.body);
    } else {
      console.log('CSP Violation: No data received!');
    }

    res.status(204).end();
  });

  // Pass anything not covered by the above to Next.js
  server.all('*', (req, res) => handleNextJsRequest(req, res));

  // Start the server
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
