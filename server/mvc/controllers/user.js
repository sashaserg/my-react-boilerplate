import DatabaseController from './database';
import Logger from '../../utils/logger';


class UserController
  {
    static getAll()
    {
      const query =  "SELECT id, login, mail, role FROM users";

      return new Promise( (resolve, reject ) =>
      {
        DatabaseController.runQuery(query)
          .then( (result) => { return resolve( result ) })
          .catch( (error) =>
          {
            Logger.SQLQueryError(error, query) ;
            reject(error);
          });
      })
    }

    static getById(id)
    {
      const query =  `SELECT id, login, mail, role FROM users WHERE id = ${id}`;

      return new Promise( (resolve, reject ) =>
      {
        DatabaseController.runQuery(query)
          .then((result) =>
          {
            return resolve(result[0])
          })
          .catch((error) =>
          {
            Logger.SQLQueryError(error, query);
            reject(error);
          });
      });
    }

    static getWithAccessInfoById(id)
    {
      const query =  `SELECT 
      u.id as id, login, mail, level as access
      FROM users AS u 
      INNER JOIN roles AS r 
      ON r.id = u.role
      WHERE u.id = '${id}'`;

      return new Promise( (resolve, reject ) =>
      {
        DatabaseController.runQuery(query)
          .then((result) =>
          {
            return resolve(result[0])
          })
          .catch((error) =>
          {
            Logger.SQLQueryError(error, query);
            reject(error);
          });
      });
    }

    static getByLogin(login)
    {
      const query =  `SELECT 
      u.id as id, login, password, level as access
      FROM users AS u 
      INNER JOIN roles AS r 
      ON r.id = u.role
      WHERE login = '${login}'`;

      return new Promise( (resolve, reject ) =>
      {
        DatabaseController.runQuery(query)
          .then((result) =>
          {
            return resolve(result[0])
          })
          .catch((error) =>
          {
            Logger.SQLQueryError(error, query);
            reject(error);
          });
      });
    }

    static create ()
    {

    }
  }

export default UserController;

/*
{


  getByLogin: function ( login, callback  )
  {
    const query =  "SELECT id, login, mail, password, role " +
      "FROM " +
      "users " +
      "WHERE login = '" + login + "'";

    DatabaseController.runQuery( query, function ( err, rows )
    {
      handleSQLErr(err, query);
      callback( null, rows[0] );
    } );
  },

  getByRole: function ( role, callback )
  {
    let roles =
      {
        admins: 2,
        moders: 1,
        users: 0
      };

    const query =  "SELECT * FROM users WHERE role='" + roles[role] + "'";

    DatabaseController.runQuery( query, function ( err, result, fields )
    {
      handleSQLErr(err, query);
      callback(null, result);
    } );
  },

  updateById: function ( id, params, callback )
  {
    const query =  "UPDATE  users " +
      "SET " +
      "login = '" + params.login        + "'," +

      (    params.password == undefined || params.password == ""
          ? ""
          : "password ='" + hashPassword(params.password) + "',"
      ) +

      "mail ='" + params.mail          + "'," +
      "role ='" + params.role           + "'" +
      " WHERE( id='"+ params.id +"' )";

    DatabaseController.runQuery( query, function ( err, result, fields )
    {
      handleSQLErr(err, query);
      callback( null, result );
    } );

  },

  create: function ( params, callback )
  {
    const role = params.role == undefined?"0":params.role;

    //=======================================================

    if( params.login.lenght < 5 || params.password.length < 5
      || params.mail.length < 5 )
    {
      const err = "Invalid user information.";
      callback(  err ,null );

      return;
    }

    const preparedString = "'" + params.login.trim() + "'," +
      "'" + hashPassword(params.password) + "'," +
      "'" + params.mail.trim() + "'," +
      "'" + role + "'";

    const query =  "INSERT INTO users(login,password,mail,role) VALUES( " + preparedString + " )";

    DatabaseController.runQuery( query, function ( err, result )
    {
      handleSQLErr(err, query);
      callback( null, result );
    } );

  },

  delete: function ( id, callback  )
  {
    const query =  "DELETE FROM users WHERE id = " + id;

    DatabaseController.runQuery( query, function ( err, result, fields )
    {
      handleSQLErr(err, query);
      callback(null, result);
    } );

  }
};

*/