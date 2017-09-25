/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import halogen from 'halogen';

import './App.css';

import { getAllAccountsIdsNames, getAccountById } from '../actions/account';
import { getRepairsFromUserByDate, deleteRepair } from '../actions/repair';

import FilterDateRange from '../components/filterDateRange';
import ConfirmationPanel from '../components/confirmationPanel';
import RepairItem from './RepairItem';
import UserPicker from './UserPicker';

import { MANAGER } from '../reducers/account';

const ANY = 0;
const COMPLETE = 1;
const INCOMPLETE = 2;

const Loader = halogen.RingLoader;

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    repairs: PropTypes.object.isRequired,
    accountsList: PropTypes.array.isRequired,
    accountsIds: PropTypes.array.isRequired,
    getRepairsFromUserByDate: PropTypes.func.isRequired,
    getAllAccountsIdsNames: PropTypes.func.isRequired,
    deleteRepair: PropTypes.func.isRequired,
    getAccountById: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      query: '',
      deleteConfirmationShow: false,
      lastRepairId: '',
      range: {
        dateFrom: new Date(),
        dateTo: new Date(),
      },
      userId: null,
      openUserPicker: false,
      filterComplete: 0,
    };

    this.openUpdateRepair = this.openUpdateRepair.bind(this);
    this.confirmDeleteRepair = this.confirmDeleteRepair.bind(this);
    this.clickDeleteOnConfirmation = this.clickDeleteOnConfirmation.bind(this);
    this.onNewDateFilter = this.onNewDateFilter.bind(this);
    this.onUserPickerOpen = this.onUserPickerOpen.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.onUserPickerClose = this.onUserPickerClose.bind(this);
    this.onCompleteChange = this.onCompleteChange.bind(this);

    this.loadInitialData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.account.logged !== this.props.account.logged) {
      this.loadInitialData();
    }
  }

  loadInitialData() {
    if (this.props.account && this.props.account.logged) {
      this.props.getAccountById(this.props.account.id);
      this.props.getAllAccountsIdsNames();
      this.props.getRepairsFromUserByDate(
        this.props.account.id,
        this.state.range.dateFrom,
        this.state.range.dateTo,
      );
    }
  }

  openUpdateRepair(repairM) {
    this.props.history.push(`/update-repair/${repairM._id}`);
  }

  confirmDeleteRepair(repairM) {
    this.setState({
      lastRepairId: repairM._id,
      deleteConfirmationShow: true,
    });
  }

  clickDeleteOnConfirmation(option) {
    if (option === 'yes') {
      if (this.state.lastRepairId) {
        this.props.deleteRepair(this.state.lastRepairId);
      }
    }
    this.setState({
      lastRepairId: '',
      deleteConfirmationShow: false,
    });
  }

  onNewDateFilter(range) {
    this.setState({ range });
    const { account } = this.props;
    if (account.logged) {
      this.props.getRepairsFromUserByDate(account.id, range.dateFrom, range.dateTo);
    }
  }

  getCurrentUser() {
    const accountId = this.props.account.id;
    return this.props.accountsList.filter(user => (
      user._id === accountId
    ))[0] || null;
  }

  isSameDate(date1, date2) {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getYear() === date2.getYear();
  }

  getCurrentUserRepairList() {
    const accountId = this.props.account.id;
    const { dateFrom, dateTo } = this.state.range;

    const validFilterComplete = (rep) => {
      switch (this.state.filterComplete) {
        case ANY:
          return true;
        case COMPLETE:
          return rep.complete;
        case INCOMPLETE:
          return !rep.complete;
        default:
          return false;
      }
    };
    const validFilterDate = rep => (
      (dateFrom <= rep.date && rep.date <= dateTo) ||
      this.isSameDate(dateFrom, rep.date) ||
      this.isSameDate(dateTo, rep.date)
    );
    return this.props.repairs.repairsList.filter(rep => (
      rep.owner === accountId && validFilterComplete(rep) && validFilterDate(rep)
    ));
  }

  onUserPickerOpen() {
    this.setState({ openUserPicker: true });
  }

  handleUserClick(user) {
    this.setState({ userId: user._id, openUserPicker: false });
    this.props.history.push(`/user-repairs/${user._id}`);
  }

  onUserPickerClose() {
    this.setState({ openUserPicker: false });
  }

  getUserName() {
    let userName = '';
    this.props.accountsIds.forEach((user) => {
      if (user._id === this.state.userId) {
        userName = user.name;
      }
    });
    return userName;
  }

  onCompleteChange() {
    this.setState({
      filterComplete: (this.state.filterComplete + 1) % 3,
    });
  }

  getCompleteStatusName() {
    switch (this.state.filterComplete) {
      case ANY:
        return 'ANY';
      case COMPLETE:
        return 'COMPLETE';
      case INCOMPLETE:
        return 'INCOMPLETE';
      default:
        return '';
    }
  }

  render() {
    const userM = this.getCurrentUser();
    if (!userM) return null;
    return (
      <div
        className={classNames('peb-center-ctn peb-users-list')}
      >
        <h2>{userM.name} repairs</h2>
        <FilterDateRange onNewFilter={this.onNewDateFilter} />
        <div className="row">
          <label htmlFor="userPicker">Filter By User:</label>
          <button
            id="userPicker"
            className="peb-input"
            onClick={this.onUserPickerOpen}
          >
            {this.state.userId === null ? 'Select another User' : (
              <div className="user">{this.getUserName()}</div>
            )}
          </button>
          <UserPicker
            open={this.state.openUserPicker}
            onUserClick={this.handleUserClick}
            onClose={this.onUserPickerClose}
          />
        </div>
        <div className="row">
          <label htmlFor="completePicker">Filter By Status:</label>
          <button
            id="completePicker"
            className="peb-input"
            onClick={this.onCompleteChange}
          >
            <div className="complete">{this.getCompleteStatusName()}</div>
          </button>
        </div>
        <div className="peb-list">
          <ReactCSSTransitionGroup
            transitionName="repairs"
            transitionEnterTimeout={10}
            transitionLeaveTimeout={10}
          >
            {this.getCurrentUserRepairList().map(repairM => (
              <RepairItem
                data={repairM}
                key={repairM._id}
                onUpdateClick={this.openUpdateRepair}
                onDeleteClick={this.confirmDeleteRepair}
                hideUpdateDelete={this.props.account && this.props.account.role < MANAGER}
              />
            ))}
          </ReactCSSTransitionGroup>
        </div>
        {this.props.repairs.repairsListLoading ?
          <div className="hv-loading"><Loader color="#006494" /></div>
          : null}
        <ConfirmationPanel
          open={this.state.deleteConfirmationShow}
          clickOnOption={this.clickDeleteOnConfirmation}
        >
          Are you sure you want to delete this item ? This action cannot be undone.
        </ConfirmationPanel>
      </div>
    );
  }
}

export default connect(
  ({ account, accounts, repairs }) => ({
    account,
    accountsIds: accounts.accountsIds,
    accountsList: accounts.accountsList,
    accountsListLoading: accounts.accountsListLoading,
    repairs,
  }),
  dispatch => bindActionCreators({
    getAllAccountsIdsNames,
    getRepairsFromUserByDate,
    deleteRepair,
    getAccountById,
  }, dispatch),
)(App);
