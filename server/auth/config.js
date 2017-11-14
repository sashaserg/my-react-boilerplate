import localSignInStrategy from './commonSignIn';
import AuthController from '../mvc/controllers/auth'


module.exports = (passport) =>
{
  passport.serializeUser((user, done) =>
  {
    done(null, user);
  });

  passport.deserializeUser((user, done) =>
  {
    AuthController.getWithAccessInfoById(user.id)
      .then( (user) =>
      {
        return done(null, user);
      })
      .catch( (error) =>
      {
        return done(error);
      });
  });


  passport.use( 'local-login', localSignInStrategy );
};
