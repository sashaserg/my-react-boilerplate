import React, {Component} from 'react'
import socketIOClient from "socket.io-client";

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
        inputText: "",

        socketOptions:
          {
            endpoint: "http://127.0.0.1:3000",
            socket: null
          }
      };

    this.bindSocket = this.bindSocket.bind(this);
  }

  componentWillMount()
  {
    this.bindSocket();
  }

	componentDidMount()
	{
		this.props.testActions.testAction();
		this.props.testActions.testActionAsync();
	}

	//=============================================================================

  sendSocketMessage(e)
  {
    this.state.socket.emit('sendMessage', this.state.inputText)
  }

  handleInputChange(e)
  {
    this.setState({inputText:e.target.value});
  }

  handleInputDataRenew(data)
  {
    console.log(`Received update from the server: ${data}`);
    this.setState({inputText: data});
  }

	bindSocket()
  {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);

    socket.on("renewMessageText", data => this.handleInputDataRenew(data));

    this.setState({socket:socket}, console.log("Socket successfully bound."));
  }

	//==============================================================================

  render()
  {
    return (
     <div>
       <input value={this.state.inputText}
              onChange={ (e) => { this.handleInputChange(e) } } />
       <br/>
       <button onClick={ (e) => { this.sendSocketMessage(e) } }>
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