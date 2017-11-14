import config from '../bin/config';
const consoleLogEnabled = config.consoleLogEnabled;
const mailLogEnabled = config.mailLogEnabled;


// - format utils -
const endl = "\n";
const separator = "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=";
// =-=-=-=-=-=-=-=


class Logger
{
  static _logMessage(message)
  {
    if (consoleLogEnabled)
    {
      console.log(message);
    }

    if(mailLogEnabled)
    {
      // send email notification here
    }
  }

  static SQLQueryError(error, query)
  {
    const errorTime = Date.now().toLocaleString();
    const errorQuery = `Query: + ${query}`;
    const errorMessage = `${separator} ${endl} ${errorTime} ${endl}  ${errorQuery} ${endl}  ${error} ${endl}${separator}`;

    this._logMessage(errorMessage);
  }

  static apiError(error, message, path)
  {
    const errorTime = Date.now().toLocaleString();
    const errorPath = `Path: + ${path}`;

    const errorMessage = `${separator} ${endl} ${errorTime} ${endl}  ${errorPath} ${endl} ${error} ${endl} ${message}${endl}${separator}`;

    this._logMessage(errorMessage);
  }

  static userAuthError( error, login )
  {
    const errorTime = Date.now().toLocaleString();
    const errorDesc = `Auth login: ${login}`;

    const errorMessage = `${separator} ${endl}${errorTime} ${endl}${errorDesc} ${endl}${error}${endl}${separator}`;

    this._logMessage(errorMessage)
  }
}

export default Logger;