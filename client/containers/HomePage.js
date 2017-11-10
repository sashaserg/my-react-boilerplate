import React, {Component} from 'react';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import testActions from '../actions/test';

import {Row} from 'react-bootstrap';
import HeaderBar from "../components/common/HeaderBar";
import FooterGeneral from "../components/common/FooterGeneral";


class HomePage extends Component
{
	constructor(props)
	{
		super(props);
	}

	componentDidMount()
	{
		this.props.testActions.testAction();
		this.props.testActions.testActionAsync();
	}

	render()
	{
		return (
			<Row id={"HomePage"}>

				<HeaderBar/>

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
		testActions: bindActionCreators(testActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)