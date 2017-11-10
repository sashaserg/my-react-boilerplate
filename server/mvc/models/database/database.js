import mysql from 'mysql';

const connectionData =
  {
    host: "localhost",
    user: "root",
    password: "user",
    database: 'my_project'
  };

function checkTables ()
{
  // check tables here
  // role
  // users
}

const DataBase = mysql.createConnection( connectionData );

module.exports.DataBase = DataBase;
module.exports.checkTables = checkTables;
