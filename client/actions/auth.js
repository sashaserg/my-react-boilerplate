import { createActionAsync } from 'redux-act-async';

const actions =
	{

		login: createActionAsync('AUTH_LOGIN_COMMON', ( data ) =>
		{
			const loginUrl = '/api/auth/login';
			const body = JSON.stringify( { login: data.login, password: data.password });
			const settings =
			{
				headers:
        {
          "Content-Type": "application/json",
          "Accept" : "application/json",
        },

        credentials: 'same-origin',

        method: 'POST',
				body: body
			};

			return fetch(loginUrl, settings)
				.then( answer => answer.json() )
				.then( (data) =>
					{
            if(data.confirmation == false)
						{
              throw new Error('Wrong credentials.');
            }
						else if(data.confirmation == true)
						{
							const userData =
								{
									id: data.answer.id,
									login: data.answer.login,
                  mail: data.answer.mail,
                  access: data.answer.access
								};

							return Promise.resolve(userData);
						}
						// no connection
						else
						{
              throw new Error("Connection error.");
            }
					})
				.catch( (error) =>
				{
					// Wrong data or no connection;
					return Promise.reject(error);
				});
			// !NO RETHROW TO DEAL WITH ERRORS ONLY IN PROMISE
		}, { noRethrow:true }),


		checkAuth: createActionAsync('AUTH_CHECK_COMMON', () =>
		{
			const loginUrl = '/api/auth/status';
			const settings =
			{
				headers:
        {
          "Content-Type": "application/json",
          "Accept" : "application/json",
        },

        credentials: 'same-origin',

        method: 'GET'
			};

			return fetch( loginUrl, settings )
				.then( answer => answer.json() )
				.then( (data) =>
					{
            if(data.confirmation == true)
						{
							if(data.answer.logged == true)
							{
							  // move user data to storage
                return Promise.resolve(data.answer.user);
							}
							else
							{
							  // remove user data from storage
								return Promise.resolve(null);
							}
						}
						// no connection
						else
						{
              throw new Error("Connection error.");
            }
					})
				.catch( (error) =>
				{
					// Wrong data or no connection;
					return Promise.reject(error);
				});
			// !NO RETHROW TO DEAL WITH ERRORS ONLY IN PROMISE
		}, { noRethrow:true }),


		logout: createActionAsync('AUTH_LOGOUT', ( ) =>
		{
			const logoutUrl = '/api/auth/logout';
			const settings =
			{
				headers:
					{
						"Content-Type": "application/json",
						"Accept" : "application/json",
					},

				credentials: 'same-origin',

				method: 'POST',
			};

      return fetch( logoutUrl, settings )
        .then( answer => answer.json() )
        .then( (data) =>
        {
          if(data.confirmation == true)
          {
            return Promise.resolve();
          }
          else if(data.confirmation == false)
          {
            throw new Error("Logout error.");
          }
          // no connection
          else
          {
            throw new Error("Connection error.");
          }
        })
        .catch( (error) =>
        {
          // Wrong data or no connection;
          return Promise.reject(error);
        });
        // !NO RETHROW TO DEAL WITH ERRORS ONLY IN PROMISE
    }, { noRethrow:true })

	};

export default actions;