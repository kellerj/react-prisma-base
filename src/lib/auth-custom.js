const { Strategy } = require('passport-custom');

const userTemplate = { id: "auser", name: "Logged In User"};

module.exports = {
  passportAuthMethod: 'custom',
  configure: (passport) => {
    // console.log('Initializing Local System Custom Authentication using passport library ' + passport);

    passport.use(new Strategy( (req, done) => {
      // console.dir(Object.assign({},userTemplate));
      return done(null, Object.assign({},userTemplate) );
    }));

    // These are just here as a matter of form
    passport.serializeUser( (user, cb) => {
      // console.log(`serializeUser: ${JSON.stringify(user)}`);
      cb(null, user.id);
    });

    passport.deserializeUser(  (id, cb) => {
      // console.log(`deserializeUser: ${JSON.stringify(id)}`);
      cb(null, Object.assign({},userTemplate));
    });
  }
};
