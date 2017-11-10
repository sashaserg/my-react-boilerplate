import { combineReducers } from 'redux-immutable';
import { routerReducer } from 'react-router-redux';

import test from './test';
import auth from './auth';

const rootReducer = combineReducers(
    {
        test,
        auth: auth,
        routing: routerReducer
    });

export default rootReducer;