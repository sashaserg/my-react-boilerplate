import config from '../bin/config';
const logEnabled = config.serverLogEnabled;

const endl = "\n";
const separator = "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=";


class Logger
{
  static SQLQueryError(error, query)
  {
    const errorTime = Date.now().toLocaleString();
    const errorQuery = `Query: + ${query}`;
    const errorMessage = `${separator} ${endl} ${errorTime} ${endl}  ${errorQuery} ${endl}  ${error} ${endl}${separator}`;


    if (logEnabled)
    {
      console.log( errorMessage );
    }
  }

  static apiError( error, message, path )
  {
    const errorTime = Date.now().toLocaleString();
    const errorPath = `Path: + ${path}`;
    const errorMsg = message;

    const errorMessage = `${separator} ${endl} ${errorTime} ${endl}  ${errorPath} ${endl} ${error} ${endl} ${errorMsg}${endl}${separator}`;


    if (logEnabled)
    {
      console.log( errorMessage );
    }
  }

  static userAuthError( error, login )
  {
    const errorTime = Date.now().toLocaleString();
    const errorDesc = `Auth login: ${login}`;

    const errorMessage = `${separator} ${endl}${errorTime} ${endl}${errorDesc} ${endl}${error}${endl}${separator}`;


    if (logEnabled)
    {
      console.log( errorMessage );
    }
  }
}

export default Logger;