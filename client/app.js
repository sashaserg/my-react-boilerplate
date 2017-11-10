// # INITIALIZING COMPONENT FOR APP

import React from 'react';
import { render } from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';

import configureStore, { history } from './utils/configureStore';
import { Provider } from 'react-redux';

import './styles/global.scss';
const store = configureStore();

import Root from './root';

// ================= check mode fn block =========================

{
if( process.env.NODE_ENV !== 'production' )
	{
		console.log('Looks like we are in development mode!');
	}
else
	{
		// We are in production mode.
	}
}

if (module.hot)
{
  console.log("Reloading components...");

  module.hot.accept( () =>
	{
    console.log('Mentioned component("") reloading!');
	})
}

//===============================================================

render(

	<Provider store={store}>
		<ConnectedRouter history={history}>
			<Root/>
		</ConnectedRouter>
	</Provider>,

	document.getElementById('root')
);
