import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import logo from '../logo.svg';
import './App.css';
import {
  loadAccountData,
} from '../actions/account';

function App(props) {
  const onClick = () => {
    props.loadAccountData();
  };
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
      <a onClick={onClick} role="button" tabIndex="0">TEST</a>
    </div>
  );
}

App.propTypes = {
  loadAccountData: PropTypes.func.isRequired,
};

export default connect(
  ({ account }) => ({
    account,
  }),
  dispatch => bindActionCreators({
    loadAccountData,
  }, dispatch),
)(App);

