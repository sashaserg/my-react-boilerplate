import { createReducer } from 'redux-act';
import { Map, fromJS } from 'immutable';

import testActions from '../actions/test';

const initialState = fromJS(
	{
		arr: [],
		obj: {field:"null"},
		loading: false
	});

export default createReducer(
	{

		[testActions.testAction.type]: (state, payload) => {
			return state.set('arr', fromJS(["tmp", "tmp", "tmp"]));
		},

		[testActions.testActionAsync.request]: (state, payload) => {
			return state
				.set('loading', true)
				.set('obj', fromJS({}));
		},
		[testActions.testActionAsync.ok]: (state, payload) => {
			return state
				.set('loading', false)
				.set('obj', fromJS(payload.response) );
		},
		[testActions.testActionAsync.error]: (state, payload) => {
			return state
				.set('loading', false)
				.set('obj', fromJS({}));
		},

	},

	initialState
);
