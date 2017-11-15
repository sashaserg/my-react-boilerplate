import mysql from 'mysql';

import config from '../../../bin/config';
const connectionData = config.database.connectionData;

function checkTables ()
{
  // check tables here
  // role
  // users
}

const DataBase = mysql.createConnection( connectionData );

module.exports.DataBase = DataBase;
module.exports.checkTables = checkTables;
