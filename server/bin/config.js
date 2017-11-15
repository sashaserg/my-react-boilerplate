const config =
  {

    // =-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=

    consoleLogEnabled: true,
    mailLogEnabled: true,

    // =-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=

    session:
      {
        secret: "a9t0AWT21nKJh1612G2gAb",
        resave: false,
        saveUninitialized: false
      },

    // =-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=

    database:
      {
        connectionData:
          {
            host: "localhost",
            user: "root",
            password: "Dead1408",
            database: 'my_project'
          }
      }

};

export default config;