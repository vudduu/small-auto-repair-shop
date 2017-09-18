import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './App.css';
import {
  getAuth,
} from '../actions/account';

function App(props) {
  const onClick = () => {
    props.getAuth();
  };
  return (
    <div className="App">
      Home
      <a onClick={onClick} role="button" tabIndex="0">TEST</a>
    </div>
  );
}

App.propTypes = {
  getAuth: PropTypes.func.isRequired,
};

export default connect(
  ({ account }) => ({
    account,
  }),
  dispatch => bindActionCreators({
    getAuth,
  }, dispatch),
)(App);

