import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';

import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import rootReducer from '../reducers/index';
export const history = createHistory();

const composeEnhancers = composeWithDevTools({/* options like actionSanitizer, stateSanitizer [can be found on dev-tools page] */});


function configureStore(initialState)
{
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares =
    [
      thunk,
      reactRouterMiddleware,
    ];

  return createStore(rootReducer, initialState,
    composeEnhancers( applyMiddleware(...middlewares  )) );
}


export default configureStore;