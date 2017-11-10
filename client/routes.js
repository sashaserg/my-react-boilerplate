// # ROUTER COMPONENT FOR APP

import React, {Component} from 'react';

import { Route } from 'react-router';
import { Switch } from 'react-router-dom';
import { Grid } from 'react-bootstrap';


import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';


class routes extends Component
{
	render()
	{
		return (

			<Grid>

				<Switch>

					<Route exact path="/" component={HomePage}/>
					<Route exact path="/home" component={HomePage}/>
					<Route exact path="/login" component={LoginPage}/>

				</Switch>

			</Grid>

			)
	}
}

export default routes;