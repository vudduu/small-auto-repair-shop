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

import { MANAGER } from '../../reducers/account';

const Loader = halogen.RingLoader;

class UsersList extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    accountsList: PropTypes.array.isRequired,
    accountsListLoading: PropTypes.bool.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    getAccountsList: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      query: '',
      deleteConfirmationShow: false,
      lastUserId: '',
    };

    this.goRepairsList = this.goRepairsList.bind(this);
    this.openUpdateUser = this.openUpdateUser.bind(this);
    this.onClickMoreAccountsLoad = this.onClickMoreAccountsLoad.bind(this);
    this.confirmDeleteUser = this.confirmDeleteUser.bind(this);
    this.clickDeleteOnConfirmation = this.clickDeleteOnConfirmation.bind(this);

    if (props.account.logged && props.account.role >= MANAGER) {
      this.props.getAccountsList();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.account.logged !== this.props.account.logged) {
      if (this.props.account.role >= MANAGER) {
        this.props.getAccountsList();
      }
    }
  }

  goRepairsList(userM) {
    console.log(userM);
    // this.navigate("/account-repairs/" + userM._id);
  }

  openUpdateUser(userM) {
    this.props.history.push(`/user/update/${userM._id}`);
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
      lastUserId: '',
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
            {this.props.accountsList.map(userM => (
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
        { this.props.accountsListLoading ?
          <div className="hv-loading"><Loader color="#006494" /></div>
          : null }
        <button onClick={this.onClickMoreAccountsLoad} >
          Load More Users
        </button>
        <ConfirmationPanel
          open={this.state.deleteConfirmationShow}
          clickOnOption={this.clickDeleteOnConfirmation}
        >
          Are you sure ?
        </ConfirmationPanel>
      </div>
    );
  }
}

export default connect(
  ({ account, accounts }) => ({
    account,
    accountsList: accounts.accountsList,
    accountsListLoading: accounts.accountsListLoading,
  }),
  dispatch => bindActionCreators({
    deleteAccount,
    getAccountsList,
  }, dispatch),
)(UsersList);
