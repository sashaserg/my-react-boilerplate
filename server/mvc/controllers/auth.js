import DatabaseController from './database';
import Logger from '../../utils/logger';


class AuthController
  {
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
  }

export default authController;