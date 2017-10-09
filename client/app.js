import React, { Component } from 'react';
import { render } from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';

import configureStore, { history } from './store/configureStore';
import { Provider } from 'react-redux';

import './styles/global.scss';
const store = configureStore();

import Routes from './routes'

// ================= check mode fn block =========================

{
	if( process.env.NODE_ENV === 'production' )
	{
		console.log('Looks like we are in production mode!');
  }
  else
	{
    console.log('Looks like we are in development mode!');
	}
}

//===============================================================

class App extends Component
{
	render()
	{
		return (

			<Provider store={store}>
				<ConnectedRouter history={history}>

							<Routes/>

				</ConnectedRouter>
			</Provider>

		);
	}
}

render(
	<App/>,
	document.getElementById('root')
);
