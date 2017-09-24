/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import halogen from 'halogen';

import './index.css';

import { getRepairsFromUserByDate } from '../../actions/repair';

import FilterDateRange from '../../components/filterDateRange';
import ConfirmationPanel from '../../components/confirmationPanel';
import RepairItem from '../RepairItem';

import { MANAGER } from '../../reducers/account';

const Loader = halogen.RingLoader;

class UserRepairs extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    repairs: PropTypes.object.isRequired,
    accountsList: PropTypes.array.isRequired,
    getRepairsFromUserByDate: PropTypes.func.isRequired,
    // deleteRepair: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      query: '',
      deleteConfirmationShow: false,
      lastUserId: '',
      range: {},
    };

    this.openUpdateRepair = this.openUpdateRepair.bind(this);
    this.confirmDeleteRepair = this.confirmDeleteRepair.bind(this);
    this.clickDeleteOnConfirmation = this.clickDeleteOnConfirmation.bind(this);
    this.onNewDateFilter = this.onNewDateFilter.bind(this);

    this.loadInitialData(props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.account.logged !== this.props.account.logged) {
      this.loadInitialData(this.props);
    }
    const userM = this.getCurrentUser();
    if (!userM) {
      this.props.history.push('/users-list');
    }
  }

  loadInitialData(props) {
    if (props.account.logged && props.account.role >= MANAGER && props.match.params.accountId) {
      this.props.getRepairsFromUserByDate(props.match.params.accountId);
    }
    if (props.account.id === props.match.params.accountId) {
      this.props.getRepairsFromUserByDate(props.match.params.accountId);
    }
  }

  openUpdateRepair(repairM) {
    this.props.history.push(`/update-repair/${repairM._id}`);
  }

  confirmDeleteRepair(userM) {
    this.setState({
      lastUserId: userM._id,
      deleteConfirmationShow: true,
    });
  }

  clickDeleteOnConfirmation(option) {
    if (option === 'yes') {
      if (this.state.lastUserId) {
        // this.props.deleteAccount(this.state.lastUserId);
      }
    }
    this.setState({
      lastUserId: '',
      deleteConfirmationShow: false,
    });
  }

  onChange() {
    // this.setState(getStateFromStores(this.state.query));
  }

  onNewDateFilter(range) {
    const { account, match } = this.props;
    if (account.logged && account.role >= MANAGER && match.params.accountId) {
      this.props.getRepairsFromUserByDate(match.params.accountId, range.dateFrom, range.dateTo);
    }
    if (account.id === match.params.accountId) {
      this.props.getRepairsFromUserByDate(match.params.accountId, range.dateFrom, range.dateTo);
    }
    this.setState({ range });
  }

  getCurrentUser() {
    const { accountId } = this.props.match.params;
    return this.props.accountsList.filter(user => (
      user._id === accountId
    ))[0] || null;
  }

  getCurrentUserRepairList() {
    const { accountId } = this.props.match.params;
    return this.props.repairs.repairsList.filter(rep => (
      rep.owner === accountId
    ));
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
        <div className="peb-list">
          <ReactCSSTransitionGroup
            transitionName="repairs"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}
          >
            {this.getCurrentUserRepairList().map(repairM => (
              <RepairItem
                data={repairM}
                key={repairM._id}
                onUpdateClick={this.openUpdateRepair}
                onDeleteClick={this.confirmDeleteRepair}
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
          Are you sure ?
        </ConfirmationPanel>
      </div>
    );
  }
}

export default connect(
  ({ account, accounts, repairs }) => ({
    account,
    accountsList: accounts.accountsList,
    accountsListLoading: accounts.accountsListLoading,
    repairs,
  }),
  dispatch => bindActionCreators({
    getRepairsFromUserByDate,
  }, dispatch),
)(UserRepairs);
