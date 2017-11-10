import React, {Component} from 'react';

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

	componentDidMount()
	{
	}


	//==============================================================

	handleFormSubmit(data)
	{
		this.props.auth.login(data);
	}

	//==============================================================

	render()
	{
		return (
			<Row id={"LoginPage"}>

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
		test: state.get('test').toJS()
	}
}

function mapDispatchToProps(dispatch)
{
	return {
		auth: bindActionCreators(authActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)