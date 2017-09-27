import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button, Grid, Row} from 'react-bootstrap'

import PaintComponent from '../components/PaintComponent'

import { bindActionCreators } from 'redux';
import testActions from '../actions/test'

class HomePage extends Component
{
	constructor(props)
	{
		super(props);

		this.state =
			{
				numbers: []
			};
	}

	render()
	{

		return (
			<Grid fluid={true}>
				<Row className={"text-center"}>

					<div id={"paintComponentWrapper"}>
						<PaintComponent/>
					</div>

				</Row>
			</Grid>
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