import { combineReducers } from 'redux-immutable';
import { routerReducer } from 'react-router-redux';

import test from './test'

const rootReducer = combineReducers(
    {
        test,
        routing: routerReducer
    });

export default rootReducer;