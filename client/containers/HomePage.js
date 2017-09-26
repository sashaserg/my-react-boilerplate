import React, {Component} from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux';

import testActions from '../actions/test'

class HomePage extends Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			propsArray: [this.props]
		}
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
				HomePage
			</div>
		)
	}
}


function mapStateToProps (state) {
	return {
		test: state.get('test').toJS()
	}
}

function mapDispatchToProps(dispatch) {
	return {
		testActions: bindActionCreators(testActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)