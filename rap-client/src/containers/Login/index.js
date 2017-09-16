import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SHA256 from 'crypto-js/sha256';

import './index.css';

import { loginAccount } from '../../actions/account';

class Login extends Component {
  static propTypes = {
    loginAccount: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      usernameError: '',
      passwordError: '',
    };
    this.onLogin = this.onLogin.bind(this);
  }

  getUsernameError() {
    return this.state.usernameError !== '' ? (
      <div className="peb-error-label">{this.state.usernameError}</div>
    ) : null;
  }

  getPasswordError() {
    return this.state.passwordError !== '' ? (
      <div className="peb-error-label">{this.state.passwordError}</div>
    ) : null;
  }

  onLogin() {
    const obj = {
      usernameError: '',
      passwordError: '',
    };
    let error = false;
    if (this.usernameInput.value === '') {
      obj.usernameError = 'Username can\'t be empty';
      error = true;
    }
    if (this.passwordInput.value === '') {
      obj.passwordError = 'Password can\'t be empty';
      error = true;
    }
    if (!error) {
      const password = SHA256(this.passwordInput.value).toString();
      this.props.loginAccount(this.usernameInput.value, password).then((res) => {
        if (res.username && res.password) {
          this.props.history.push('/home');
        } else {
          if (!res.username) obj.usernameError = 'Invalid Username';
          else obj.passwordError = 'Invalid Password';
          this.setState(obj);
        }
      });
    } else {
      this.setState(obj);
    }
  }

  render() {
    return (
      <div
        className={classNames('peb-center-ctn peb-login-account')}
      >
        <div className="row">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            className="peb-input peb-input-txt"
            value={this.state.username}
            ref={(o) => { this.usernameInput = o; }}
          />
        </div>
        {this.getUsernameError()}
        <div className="row">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            className="peb-input peb-input-txt"
            value={this.state.password}
            ref={(o) => { this.passwordInput = o; }}
          />
        </div>
        {this.getPasswordError()}
        <div className="row">
          <button
            className="peb-input"
            onClick={this.onLogin}
          >
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => bindActionCreators({
    loginAccount,
  }, dispatch),
)(Login);
