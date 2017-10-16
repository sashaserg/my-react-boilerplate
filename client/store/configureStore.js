import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';

import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import rootReducer from '../reducers';

import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

const serverURL = 'http://localhost:3000';
let socket = io( serverURL );
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");   //actions name beginning for redirect (middleware)

export const history = createHistory();

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
});

function configureStore(initialState)
{
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares =
    [
      thunk,
      reactRouterMiddleware,
      socketIoMiddleware
    ];


  return createStore(rootReducer, initialState,
    composeEnhancers( applyMiddleware(...middlewares  )) );
}

export default configureStore;