import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import testActions from '../actions/test';

import HelloComponent from '../components/HelloComponent';

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
			<div>
				<HelloComponent parentProps={this.props.test}/>
			</div>
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