/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import halogen from 'halogen';

import './index.css';

import { deleteAccount, getAccountsList } from '../../actions/account';

import ConfirmationPanel from '../../components/confirmationPanel';
import UserItem from '../UserItem';

// import { VISITOR, REGULAR } from '../../reducers/account';

const Loader = halogen.RingLoader;

class UsersList extends Component {
  static propTypes = {
    // history: PropTypes.object.isRequired,
    // account: PropTypes.object.isRequired,
    accountsList: PropTypes.array.isRequired,
    accountsListLoading: PropTypes.bool.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    getAccountsList: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      usersList: props.accountsList || [],
      usersListLoading: props.accountsListLoading,
      complete: false,
      query: '',
      deleteConfirmationShow: false,
      lastUserId: '',
    };
    this.props.getAccountsList();
    this.goRepairsList = this.goRepairsList.bind(this);
  }

  goRepairsList(userM) {
    console.log(userM);
    // this.navigate("/account-repairs/" + userM._id);
  }

  openUpdateUser(userM) {
    console.log(userM);
    // this.navigate("/user/update/" + userM._id);
  }

  confirmDeleteUser(userM) {
    this.setState({
      lastUserId: userM._id,
      deleteConfirmationShow: true,
    });
  }

  clickDeleteOnConfirmation(option) {
    if (option === 'yes') {
      if (this.state.lastUserId) {
        this.props.deleteAccount(this.state.lastUserId);
      }
    }
    this.setState({
      deleteConfirmationShow: false,
    });
  }

  onClickMoreAccountsLoad() {
    // const page = AccountStore.getAccountsListNextPage();
    // AccountActionCreators.getAccountsList({
    //   page: page
    // });
    this.props.getAccountsList(0);
  }

  onChange() {
    // this.setState(getStateFromStores(this.state.query));
  }

  render() {
    return (
      <div
        className={classNames('peb-center-ctn peb-users-list')}
      >
        <div className="peb-list">
          <ReactCSSTransitionGroup
            transitionName="repairs"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}
          >
            {this.state.usersList.map(userM => (
              <UserItem
                data={userM}
                key={userM._id}
                onOpenRepairsClick={this.goRepairsList}
                onUpdateClick={this.openUpdateUser}
                onDeleteClick={this.confirmDeleteUser}
              />
            ))}
          </ReactCSSTransitionGroup>
        </div>
        { this.state.usersListLoading ?
          <div className="hv-loading"><Loader color="#006494" /></div>
          : null }
        <button onClick={this.onClickMoreAccountsLoad} >
          Load More Users
        </button>
        { this.state.deleteConfirmationShow ?
          <ConfirmationPanel
            clickOnOption={this.clickDeleteOnConfirmation}
          >
            Are you sure ?
          </ConfirmationPanel> : null}
      </div>
    );
  }
}

export default connect(
  ({ account }) => ({
    account,
    accountsList: [],
    accountsListLoading: false,
  }),
  dispatch => bindActionCreators({
    deleteAccount,
    getAccountsList,
  }, dispatch),
)(UsersList);
