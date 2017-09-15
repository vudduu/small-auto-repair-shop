import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from '../reducers';

const logger = createLogger({ collapsed: true });

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  logger,
)(createStore);

export default function configureStore(initialState = {}) {
  const store = createStoreWithMiddleware(rootReducer, initialState,
    window.devToolsExtension ? window.devToolsExtension() : undefined);
  if (module.hot) { // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }
  return store;
}
