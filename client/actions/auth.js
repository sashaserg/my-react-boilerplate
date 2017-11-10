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

			console.log(1)
			return fetch( loginUrl, settings )
				.then( answer => answer.json() )
				.then( (data) =>
					{
            console.log(1.5)

            if( data.confirmation == false )
						{
              throw new Error("Auth error.");
						}
						else if( data.confirmation == true )
						{
							const userData =
								{
									id: data.answer.id,
									login: data.answer.login
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
		}),

		logout: createActionAsync('AUTH_LOGOUT', ( {login, password} = {} ) =>
		{
			console.log("Sending data...");

			return Promise.resolve().then( () => { return { success: true } });
		})

	};

export default actions;