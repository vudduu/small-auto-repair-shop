import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SHA256 from 'crypto-js/sha256';
import './index.css';

import LocalizedStrings from '../../localizations/LocalizedStrings';
import { registerAccount } from '../../actions/account';
import { validateEmail } from '../../tools';

import Dropdown from '../../components/dropdown';
import ErrorPanel from '../../components/errorPanel';
import { VISITOR, REGULAR } from '../../reducers/account';

const defaultErrorFields = {
  usernameError: '',
  passwordError: '',
  passwordConfError: '',
  nameError: '',
  emailError: '',
  errorPanelShow: false,
  errorMessage: '',
};

class CreateAccount extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    registerAccount: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...defaultErrorFields,
      role: REGULAR,
    };
    this.saveAccount = this.saveAccount.bind(this);
    this.dropDownOnChange = this.dropDownOnChange.bind(this);
    this.onErrorPanelClose = this.onErrorPanelClose.bind(this);
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

  getPasswordConfError() {
    return this.state.passwordConfError !== '' ? (
      <div className="peb-error-label">{this.state.passwordConfError}</div>
    ) : null;
  }

  getNameError() {
    return this.state.nameError !== '' ? (
      <div className="peb-error-label">{this.state.nameError}</div>
    ) : null;
  }

  getEmailError() {
    return this.state.emailError !== '' ? (
      <div className="peb-error-label">{this.state.emailError}</div>
    ) : null;
  }

  dropDownOnChange({ value }) {
    this.setState({ role: value });
  }

  saveAccount() {
    const data = {
      username: this.username.value,
      password: this.password.value,
      passwordConf: this.passwordConf.value,
      name: this.name.value,
      email: this.email.value,
    };
    let error = false;
    const obj = Object.assign({}, defaultErrorFields);
    Object.keys(data).forEach((key) => {
      if (data[key] === '') {
        const fieldText = LocalizedStrings.getString(`create_account.${key}`);
        obj[`${key}Error`] = `${fieldText} can't be empty`;
        error = true;
      }
    });
    if (data.password !== data.passwordConf) {
      obj.errorPanelShow = true;
      obj.errorMessage = 'Error: the passwords do not match';
      error = true;
    }
    if (!validateEmail(data.email)) {
      obj.errorPanelShow = true;
      obj.errorMessage = 'Error: invalid email format';
      error = true;
    }
    if (error) {
      this.setState(obj);
    } else {
      const password = SHA256(data.password).toString();
      this.props.registerAccount(
        data.username,
        password,
        data.name,
        data.email,
        this.state.role,
      ).then(() => {
        this.props.history.push('/home');
      });
    }
  }

  onErrorPanelClose() {
    this.setState({
      errorPanelShow: false,
    });
  }

  render() {
    const options = [];
    if (this.props.account.role !== VISITOR && this.props.account.role !== REGULAR) {
      for (let i = 2; i <= 3; i += 1) {
        options.push({
          description: LocalizedStrings.getString(`account_role.${i}`),
          code: i,
        });
      }
    } else {
      options.push({
        description: LocalizedStrings.getString('account_role.2'),
        code: REGULAR,
      });
    }

    return (
      <div
        className="peb-center-ctn peb-create-account"
      >
        <div className="row">
          <label htmlFor="username">
            {LocalizedStrings.getString('create_account.username')}:
          </label>
          <input
            type="text"
            className="peb-input peb-input-txt"
            id="username"
            ref={(o) => { this.username = o; }}
          />
        </div>
        {this.getUsernameError()}
        <div className="row">
          <label htmlFor="password">
            {LocalizedStrings.getString('create_account.password')}:
          </label>
          <input
            type="password"
            className="peb-input peb-input-txt"
            id="password"
            ref={(o) => { this.password = o; }}
          />
        </div>
        {this.getPasswordError()}
        <div className="row">
          <label htmlFor="passwordConf">
            {LocalizedStrings.getString('create_account.passwordConf')}:
          </label>
          <input
            type="password"
            className="peb-input peb-input-txt"
            id="passwordConf"
            ref={(o) => { this.passwordConf = o; }}
          />
        </div>
        {this.getPasswordConfError()}
        <div className="row">
          <label htmlFor="name">
            {LocalizedStrings.getString('create_account.name')}:
          </label>
          <input
            type="text"
            className="peb-input peb-input-txt"
            id="name"
            ref={(o) => { this.name = o; }}
          />
        </div>
        {this.getNameError()}
        <div className="row">
          <label htmlFor="email">
            {LocalizedStrings.getString('create_account.email')}:
          </label>
          <input
            type="text"
            className="peb-input peb-input-txt"
            id="email"
            ref={(o) => { this.email = o; }}
          />
        </div>
        {this.getEmailError()}
        <div className="row">
          <label htmlFor="myDropdownCreate">Role:</label>
          <Dropdown
            id="myDropdownCreate"
            options={options}
            value={this.state.role}
            labelField="description"
            valueField="code"
            onChange={this.dropDownOnChange}
          />
        </div>

        <ErrorPanel
          show={this.state.errorPanelShow}
          onClose={this.onErrorPanelClose}
        >
          {this.state.errorMessage}
        </ErrorPanel>

        <div className="row">
          <button
            className="peb-input create-button"
            onClick={this.saveAccount}
          >
            Create
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ account }) => ({
    account,
  }),
  dispatch => bindActionCreators({
    registerAccount,
  }, dispatch),
)(CreateAccount);
