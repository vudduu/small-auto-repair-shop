import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Link,
} from 'react-router-dom';

class NavLinks extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
  };

  getDefaultNavLinks() {
    return (
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  getLoggedNavLinks() {
    console.log('NavLinks', this.props.account);
    return (
      <div className="nav-links">
        <Link to="/home">Home</Link>
      </div>
    );
  }

  render() {
    return this.props.account.logged ? this.getLoggedNavLinks() : this.getDefaultNavLinks();
  }
}

export default connect(
  ({ account }) => ({
    account,
  }),
  dispatch => bindActionCreators({
  }, dispatch),
)(NavLinks);
