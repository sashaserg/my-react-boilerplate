import express from 'express';
const router = express.Router();

import passport from 'passport';

import Logger from '../../utils/logger';
import Response from '../../utils/response';
import UserController from '../../mvc/controllers/user';


const errorMessages =
  {
    loadUsersFail: "Failed to load all users",
    loadUserFail: "Failed to load single user"
  };


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=


router.post('/login', function(req, res, next)
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
                message: "Successfully logged in.",
                login: user.login,
                id: user.id
              };

            Response.send(res, true, answer);
          }
        } )

      }
      else
      {
        const answer =
          {
            message: "Wrong data.",
          };

        Response.send(res, false, answer);
      }
    }
  }) (req,res,next);
});

router.get('/logout', (req, res, next) =>
{
  req.logout();

  const answer =
    {
      message:"Logged out."
    };

  Response.send(res, true, answer);
});

/*
router.get('/logout', function(req, res, next)
{
  UserController.getAll()
    .then( (users) =>
    {
      Response.send( res, true, { user: users } );
    })
    .catch( (err) =>
    {
      Logger.apiError(err, errorMessages.loadUsersFail, req.originalUrl) ;
      Response.send( res, false, { message: errorMessages.loadUsersFail });
    });
});


router.post('/signIn', (req, res, next ) =>
{
  passport.authenticate( 'local-signin', (err, user, info) =>
  {
    if( err )
    {
      next( err );
    }
    else
    {
      if( user )
      {
        req.logIn( user, function( err )
        {
          if( err )
          {
            return next(err);
          }

          else
          {
            return res.json(
              {
                confirmation : true,
                message      : "Successfully logged in.",
                login: user.login,
                id: user.id
              });
          }
        } )

      }
      else
      {
        return res.json(
          {
            confirmation : false,
            message      : "Wrong user data."
          });
      }

    }
  }) (req,res,next);

});

router.post('/adminSignIn', (req, res, next ) =>
{
  passport.authenticate( 'local-admin-signin', (err, user, info) =>
  {
    if( err )
    {
      next( err );
    }
    else
    {
      if( user )
      {
        req.logIn( user, function( err )
        {
          if( err )
          {
            return next(err);
          }
          else
          {
            return res.json(
              {
                confirmation : true,
                message      : "Successfully logged in.",
                login: user.login,
                id: user.id
              });
          }
        } );
      }
      else
      {
        return res.json(
          {
            confirmation : false,
            message      : "Wrong user data."
          });
      }

    }
  }) (req,res,next);

});

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

router.get('/logOut', function(req, res, next)
{
  req.logout();
  req.session.items = [];

  res.json(
    {
      confirmation:true,
      message:"Logged out."
    });
});


*/

export default router;
