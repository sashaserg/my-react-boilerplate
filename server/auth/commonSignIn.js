const LocalStrategy = require( 'passport-local' ).Strategy;
import AuthController from '../mvc/controllers/auth';

import Logger from '../utils/logger';


export default new LocalStrategy(
  {
    usernameField: 'login',
    passwordField: 'password',
  },

  ( login, password, done) =>
  {
    AuthController.getByLogin(login)
      .then( (user) =>
      {
        if(user == undefined)
        {
          throw new Error("Some user entered wrong password.");
        }

        if(user.password != password)
        {
          throw new Error("Some user entered wrong password.");
        }
        else
        {
          user = { id: user.id, login: user.login, access: user.access };
          return done( null,  user  );
        }

      })
      .catch( (error) =>
      {
        Logger.userAuthError(error, login );
        return done(null, false )
      })
  }
);
