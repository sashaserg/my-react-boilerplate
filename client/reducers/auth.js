import { createReducer } from 'redux-act';
import { Map, fromJS } from 'immutable';

import authActions from '../actions/auth';


const nullUser =
  {
    id: null,
    login: null,
    mail: null,
    access: null
  };

const initialState = fromJS(
	{
		loading: false,

		logged: false,
		user: nullUser
	});


export default createReducer(
  {

		// LOGIN SECTION

    [authActions.login.request]: (state, payload) =>
			{
				return state.set('loading', true);
			},

    [authActions.login.ok]: (state, payload) =>
			{
				return state.set('user', payload.response).set('logged', true).set('loading', false);
			},

    [authActions.login.error]: (state, payload) =>
			{
				return state.set('loading', false);
			},

		// CHECK AUTH

		[authActions.checkAuth.request]: (state, payload) =>
		{
      return state.set('loading', true);
    },

		[authActions.checkAuth.ok]: (state, payload) =>
		{
			if(payload.response === null)
			{
        return state.set('user', nullUser).set('logged', false).set('loading', false);
      }

      return state.set('user', payload.response).set('logged', true).set('loading', false);
    },

		[authActions.checkAuth.error]: (state, payload) =>
		{
      return state.set('loading', false);
    },

		// LOGOUT SECTION

    [authActions.logout.request]: (state, payload) =>
			{
				return state.set('loading', true);
			},

    [authActions.logout.ok]: (state, payload) =>
			{
				return state.set('user', fromJS(nullUser)).set('loading', false);
			},

    [authActions.logout.error]: (state, payload) =>
			{
				return state.set('loading', false);
			},

		// =================================================================


  },

	initialState
);
