import React, {Component} from 'react'
import {connect} from 'react-redux'

import MusicElement from '../components/MusicElement'

import { bindActionCreators } from 'redux';
import testActions from '../actions/test'

class HomePage extends Component
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		return (
			<div>
				<MusicElement/>
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