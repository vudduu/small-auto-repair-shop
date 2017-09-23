/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import './index.css';

import LocalizedStrings from '../../localizations/LocalizedStrings';
import Dropdown from '../../components/dropdown';
import { updateAccount } from '../../actions/account';

class UpdateUser extends Component {
  static propTypes = {
    active: PropTypes.bool,

    account: PropTypes.object.isRequired,
    accountsList: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    updateAccount: PropTypes.func.isRequired,
  };

  static defaultProps = {
    active: false,
  };

  constructor(props) {
    super(props);
    const { accountId } = props.match.params;
    if (props.account.logged) {
      const [userM] = props.accountsList.filter(user => (
        user._id === accountId
      ));
      if (userM) {
        this.state = {
          username: userM.username,
          email: userM.email,
          name: userM.name,
          enabled: userM.enabled,
          role: userM.role,
        };
      }
    }
    this.handleChangeText = this.handleChangeText.bind(this);
    this.dropDownOnChange = this.dropDownOnChange.bind(this);
    this.changeEnabled = this.changeEnabled.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  // componentDidMount() {
  // }
  //
  // componentWillUnmount() {
  // }

  handleChangeText() {
    this.setState({
      username: this.username.value,
      email: this.email.value,
      name: this.name.value,
    });
  }

  dropDownOnChange(change) {
    this.setState({ role: change.value });
  }

  changeEnabled() {
    this.setState({ enabled: !this.state.enabled });
  }

  updateUser() {
    const { accountId } = this.props.match.params;
    this.props.updateAccount(accountId, {
      username: this.state.username,
      email: this.state.email,
      name: this.state.name,
      enabled: this.state.enabled,
      role: this.state.role,
    });
    this.props.history.push('/users-list');
  }

  render() {
    const options = [];
    const { accountId } = this.props.match.params;
    const [userM] = this.props.accountsList.filter(user => (
      user._id === accountId
    ));
    if (!userM) {
      this.props.history.push('/users-list');
      return null;
    }
    for (let i = 2; i <= 5; i += 1) {
      options.push({
        description: LocalizedStrings.getString(`account_role.${i}`),
        code: i,
      });
    }

    return (
      <div
        className={classNames('peb-center-ctn peb-edit-user', {
          active: this.props.active,
        })}
      >
        <div className="div-group">
          <label htmlFor="username">Username:</label><br />
          <input
            className="peb-input peb-input-txt"
            type="text"
            id="username"
            ref={(o) => { this.username = o; }}
            value={userM.username}
            disabled
          />
        </div>
        <div className="div-group">
          <label htmlFor="name">Name:</label><br />
          <input
            className="peb-input peb-input-txt"
            type="text"
            id="name"
            ref={(o) => { this.name = o; }}
            value={this.state.name}
            onChange={this.handleChangeText}
          />
        </div>
        <div className="div-group">
          <label htmlFor="email">Email:</label><br />
          <input
            className="peb-input peb-input-txt"
            type="text"
            id="email"
            ref={(o) => { this.email = o; }}
            value={this.state.email}
            onChange={this.handleChangeText}
          />
        </div>
        <div className="div-group">
          <label htmlFor="myDropdownRole">Role:</label><br />
          <Dropdown
            id="myDropdownRole"
            options={options}
            value={this.state.role}
            labelField="description"
            valueField="code"
            onChange={this.dropDownOnChange}
          />
        </div>
        <div className="div-group">
          <label htmlFor="enableControl">Enabled:</label>
          <div className="enabled-label">{this.state.enabled ? 'True' : 'False'}</div>
          <button
            id="enableControl"
            className="peb-input"
            onClick={this.changeEnabled}
          >
            {this.state.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
        <br />
        <div className="div-group">
          <button
            className="peb-input"
            onClick={this.updateUser}
          >
            Update
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  ({ account, accounts }) => ({
    account,
    accountsList: accounts.accountsList,
    accountsListLoading: accounts.accountsListLoading,
  }),
  dispatch => bindActionCreators({
    updateAccount,
  }, dispatch),
)(UpdateUser));
