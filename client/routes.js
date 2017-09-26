import React, {Component} from 'react';

import { Route } from 'react-router';
import { Switch } from 'react-router-dom';

import HomePage from './containers/HomePage'


class routes extends Component
{
	render()
	{
		return (

			<div>

				<Switch>

					<Route exact path="/" component={HomePage}/>
					<Route exact path="/home" component={HomePage}/>

				</Switch>

			</div>

			)
	}
}

export default routes;