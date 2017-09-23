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
import Login from './containers/Login';
import CreateAccount from './containers/CreateAccount';
import CreateRepair from './containers/CreateRepair';
import HeaderNav from './containers/HeaderNav';
import UsersList from './containers/UsersList';
import UpdateUser from './containers/UpdateUser';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import { getAuth } from './actions/account';

const store = configureStore();
getAuth()(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <HeaderNav />
        <Switch>
          <Route exact path="/home" component={App} />
          <Route exact path="/register" component={CreateAccount} />
          <Route exact path="/create-repair" component={CreateRepair} />
          <Route exact path="/users-list" component={UsersList} />
          <Route exact path="/user/update/:accountId" component={UpdateUser} />
          <Route exact path="/login" component={Login} />
          <Redirect from="/" to="/home" />
        </Switch>
      </div>
    </Router>
  </Provider>,
  window.document.getElementById('root'),
);

registerServiceWorker();
