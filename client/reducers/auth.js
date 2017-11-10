import { createReducer } from 'redux-act';
import { Map, fromJS } from 'immutable';

import authActions from '../actions/auth';


const nullUser =
  {
    id: null,
    login: null,
    mail: null,
    accessLevel: null
  };

const initialState = fromJS(
	{
		loading: false,
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
				return state.set('loading', false);
			},

    [authActions.login.error]: (state, payload) =>
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
