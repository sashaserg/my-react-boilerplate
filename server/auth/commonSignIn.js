const LocalStrategy = require( 'passport-local' ).Strategy;
import AuthController from '../mvc/controllers/auth';

import Logger from '../utils/logger';

const errorMessages =
  {
    wrongPassword: "Some user entered wrong password.",
    wrongData:"Some user entered wrong data."
  };


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
          throw new Error(errorMessages.wrongData);
        }

        if(user.password != password)
        {
          throw new Error(errorMessages.wrongPassword);
        }
        else
        {
          user = { id: user.id, login: user.login, mail: user.mail, access: user.access };
          return done( null,  user  );
        }

      })
      .catch( (error) =>
      {
        Logger.userAuthError(error, login );
        return done(error, null )
      })
  }
);
