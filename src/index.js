/**
 * @file Main entry point for front end server.  Starts Express server and mindsbinds Next.js into all paths.
 * @module server
 */
const jsonColorizer = require('json-colorizer');
const stringify = require('json-stringify-safe');
const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const getConfig = require('next/config').default;
const passport = require('passport');
const BearerStrategy = require('passport-bearer-strategy');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handleNextJsRequest = app.getRequestHandler();

const getLogger = require('./lib/logger').getLogger;
const log = getLogger('server');


const createServer = require('./apollo.js');

const { backendUrl, loggingUUID } = getConfig().publicRuntimeConfig;


// if (process.env.INSTANCE_ID === 'dev') {
//   log.debug('Running with Configuration:');
//   log.debug(jsonColorizer(stringify(parsedConfig.parsed, null, 2)));
// }

const authMethod = dev ? 'custom' : 'somethingElse';
require(`./lib/auth-${authMethod}`).configure(passport);

// Bearer token strategy for the logging endpoint.  Checks the token to confirm eligibility
passport.use(new BearerStrategy({}, (token, done) => {
  //log.info('Received Token: ' + token);
  const decodedToken = Buffer.from(token, 'base64').toString('utf8');
  //log.info('Decoded Token: ' + decodedToken);
  if ( decodedToken !== loggingUUID ) {
    log.warn(`Token Mismatch: ${decodedToken}`);
    return done(null, false, 'invalid token');
  }
  // success - don't care about the user info
  done(null, {});
}));

// Signing secret for the token, must be shared by the backend server
const jwtSecret = process.env.JWT_SECRET;

const apollo = createServer();

/**
 * Creates the Express server and sets up any needed routes before starting the server.
 */
function configureExpress() {
  const server = express();
  // JWT is in the token cookie
  server.use('*', cookieParser());
  // Needed only to parse the CSP report.  If it catches any other types, it will cause other JSON posts to Next.js to fail.
  server.use(bodyParser.json({
    type: ['application/csp-report']
  }));
  server.use(bodyParser.text());
  // Set up rules which prevent embedding of the application into other sites
  // and disallow the page from contacting sites other than itself and the backend server
  server.use(helmet({
    contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"], // default for all directives
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // only allow from self and inline code - needed for React
          styleSrc: ["'self'", "'unsafe-inline'"], // only allow from self and inline code - needed for styled components
          imgSrc: ['*'],
          objectSrc: ["'none'"], // embedded object sources
          mediaSrc: ["'none'"], // A/V media sources
          frameSrc: ["'none'"], // items allowed to be placed in frames/iframes
          fontSrc: ["'self'"],
          childSrc: ["'self'"],
          connectSrc: ["'self'", backendUrl], // limits the URLs to which the front-end code can connect
          reportUri: '/csp-violation',        // posts any attempted violations here
        },
        reportOnly: false,//process.env.NODE_ENV === 'development',
    },
    frameguard: {
      action: 'deny', // don't allow application to be displayed within a frame on another website
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
      log.warn('CSP Violation: ', req.body);
    } else {
      log.warn('CSP Violation: No data received!');
    }

    res.status(204).end();
  });

  // log information posted from the client to the server logs
  server.post('/logger', passport.authenticate('bearer'), (req, res) => {
    // user is set if the authentication was successful
    if ( req.user ) {
      getLogger('client').info(req.body);
      res.status(200).end();
      return;
    }
    res.status(403).end();
  });

  apollo.applyMiddleware({
    server,
    path: '/graphql',
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
    bodyParserConfig: true,
  });

  // Pass anything not covered by the above to Next.js
  server.all('*', (req, res) => handleNextJsRequest(req, res));

  // Start the server
  server.listen(process.env.FRONTEND_PORT, (err) => {
    if (err) throw err;
    log.info(`> Ready on ${process.env.FRONTEND_URL}`);
  });
}

app.prepare()
  .then(configureExpress)
  .catch((ex) => {
    log.error(ex.stack);
    process.exit(1);
  });
