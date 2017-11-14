import express from 'express';
const router = express.Router();

import Logger from '../../utils/logger';
import Response from '../../utils/response';
import UserController from '../../mvc/controllers/user';


// full path access => req.originalUrl
const errorMessages =
  {
    loadUsersFail: "Failed to load all users",
    loadUserFail: "Failed to load single user"
  };


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=


router.get('/', function(req, res, next)
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


router.get('/:id', function(req, res, next)
{
  const id = req.params.id;

  UserController.getById(id)
    .then( (user) =>
    {
      Response.send( res, true, { user: user } );
    })
    .catch( (err) =>
    {
      Logger.apiError(err, errorMessages.loadUsersFail, req.originalUrl) ;
      Response.send( res, false, { message: errorMessages.loadUserFail });
    });

});


export default router;
