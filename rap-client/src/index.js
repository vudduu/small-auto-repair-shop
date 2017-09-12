import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import {
  Route,
  Redirect,
  Switch,
  HashRouter as Router,
} from 'react-router-dom';

import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';

const store = configureStore({
  account: {},
});

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Redirect from="/home" to="/login" />
      </Switch>
    </Router>
  </Provider>,
  window.document.getElementById('root'),
);

registerServiceWorker();
