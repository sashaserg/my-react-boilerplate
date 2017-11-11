import localSignInStrategy from './commonSignIn';
import UserController from '../mvc/controllers/user'


module.exports = (passport) =>
{
  passport.serializeUser((user, done) =>
  {
    done(null, user);
  });

  passport.deserializeUser((user, done) =>
  {
    UserController.getWithAccessInfoById(user.id)
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
