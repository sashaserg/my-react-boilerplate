import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import authActions from '../actions/auth';

import {Row, Clearfix} from 'react-bootstrap';

import HeaderBar from "../components/common/HeaderBar";
import FooterGeneral from "../components/common/FooterGeneral";
import LoginForm from "../components/loginPage/LoginForm";


class LoginPage extends Component
{
	constructor(props)
	{
		super(props);
	}

	//==============================================================

	handleFormSubmit(data)
	{
		this.props.authActions.login(data);
	}

	//==============================================================

	authCheck()
	{
		if( this.props.auth.logged && this.props.auth.loading == false )
		{
			return(
				<Redirect to={'/home'}/>
			)
		}
		else
		{
			return null;
		}
	}

	render()
	{
		return (
			<Row id={"LoginPage"}>

				{ this.authCheck() }

				<HeaderBar/>

				<Clearfix id={"LoginSection"}>

					<LoginForm onFormSubmit={(data) => this.handleFormSubmit(data) }/>

				</Clearfix>

				<FooterGeneral/>

			</Row>
		)
	}
}


function mapStateToProps (state)
{
	return {
		auth: state.get('auth').toJS()
	}
}

function mapDispatchToProps(dispatch)
{
	return {
		authActions: bindActionCreators(authActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)