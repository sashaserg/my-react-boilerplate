import { DataBase } from '../models/database/database';
const disconnectedState = 'disconnected';


class DataBaseController
{
  static connectToDatabase ()
  {
    if( DataBase.state !== disconnectedState)
    {
      DataBase.connect( function ( err )
      {
        if(err)
        {
          throw err;
        }

        console.log("Connected to database.");
        return true;
      });
    }
  }

  static reconnectToDatabase ()
  {
    if( DataBase.state === disconnectedState )
    {
      return this.connectToDatabase()
    }
    else
    {
      return true;
    }
  }

  static checkConnection ()
  {
    return DataBase.state !== disconnectedState;
  }

  static runQuery( query )
  {
    return new Promise( (resolve, reject) =>
    {
      DataBase.query( query, (err, result) =>
      {
        if(err)
        {
          reject(err);
        }

        resolve(result);
      });
    });
  }
}

export default DataBaseController;