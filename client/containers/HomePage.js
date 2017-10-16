import React, {Component} from 'react'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux';

import testActions from '../actions/test'

class HomePage extends Component
{
  constructor(props)
  {
    super(props);

    this.state =
      {
        inputText: ""
      }
  }

  componentWillMount()
  {
    this.setState({inputText:this.props.test.message});
  }

	componentDidMount()
	{
		this.props.testActions.testAction();
		this.props.testActions.testActionAsync();
	}

	componentWillUpdate(nextProps, nextState)
  {
    if( this.props.test.message !== nextProps.test.message )
    {
      this.setState({inputText: nextProps.test.message})
    }
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    return ( nextProps.test.message !== this.state.inputText )
      || nextState.inputText !== this.state.inputText
  }

	//==============================================================================

  render()
  {
    return (
     <div>
      <input value={this.state.inputText} onChange={ (e) => { this.setState({inputText:e.target.value})} }/>
      <button onClick={ (e) => {this.props.testActions.sendTextData(this.state.inputText)} }>
        Send
      </button>
     </div>
    );
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