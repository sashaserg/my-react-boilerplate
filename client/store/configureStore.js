import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from '../reducers';

export const history = createHistory();

function configureStore(initialState)
{
    const reactRouterMiddleware = routerMiddleware(history);
    const middlewares =
        [
            thunk,
            reactRouterMiddleware,
        ];

    return createStore(rootReducer, initialState, compose( applyMiddleware (  ...middlewares  ) ) );
}

export default configureStore;