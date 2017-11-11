// # UPPER COMPONENT FOR APP

import React, {Component} from 'react';
import Routes from './routes';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import authActions from './actions/auth';

class Root extends Component
{
  componentWillMount()
  {
    this.props.auth.checkAuth();
  }

  render()
  {
    return (
        <Routes/>
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
    auth: bindActionCreators(authActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
