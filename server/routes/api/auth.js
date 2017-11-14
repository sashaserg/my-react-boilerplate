import express from 'express';
const router = express.Router();

import passport from 'passport';

import Logger from '../../utils/logger';
import Response from '../../utils/response';


const messages =
  {
    successfulLogin: "Login is successful.",
    successfulLogout: "Logged out successful.",
    wrongLoginData: "Data provided is wrong.",
    connectionError: "Error during connection"
  };

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

router.post('/login', (req, res, next) =>
{
  passport.authenticate( 'local-login', (err, user) =>
  {
    if( err )
    {
      next( err );
    }
    else
    {
      if( user )
      {
        req.logIn( user, ( err ) =>
        {
          if( err )
          {
            return next(err);
          }
          else
          {
            const answer =
              {
                message: messages.successfulLogin,

                id: user.id,
                login: user.login,
                mail: user.mail,
                access: user.access,

                session: req.sessionID
              };

            Response.send(res, true, answer);
          }
        } )

      }
      else
      {
        const answer =
          {
            message: messages.wrongLoginData,
          };

        Response.send(res, true, answer);
      }
    }
  }) (req,res,next);
});

router.post('/logout', (req, res, next) =>
{
  req.logout();

  const answer =
    {
      message: messages.successfulLogout
    };

  Response.send(res, true, answer);
});

router.get('/status', (req, res, next) =>
{
  const loggedIn = (req.user != undefined);
  const user = req.user;

  Response.send(res, true, { logged:loggedIn, user:user, session: req.sessionID });
});



/*

router.post('/signUp', (req, res, next ) =>
{
  //checking password confirmation
  if( req.body.password != req.body.passwordConfirm)
    return res.json( {confirmation: false, message: "Passwords mismatch"});

  const userData = { login: req.body.login, mail: req.body.mail, password: req.body.password };

  UserController.create( userData, (err, answer) =>
  {
    if( err )
    {
      return res.json(
        {
          confirmation: false,
          message: err
        });
    }
    else
    {
      if( answer == undefined )
        return res.json( { confirmation:false, message: "Such user exists."} );

      userData.id = answer.insertId;

      req.login( userData, (err) =>
      {
        return err
          ?  res.json(
            {
              confirmation:false,
              message: err
            })
          : res.json(
            {
              confirmation:true,
              message:"Signed up and logged successfully.",
              id: userData.id,
              login: userData.login
            });
      })
    }
  });

});

*/

export default router;
