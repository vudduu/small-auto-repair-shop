/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DayPicker from 'react-day-picker';
import ReactModal from 'react-modal';

import 'react-day-picker/lib/style.css';
import './index.css';

import { getAllAccountsIdsNames } from '../../actions/account';
import { repairCreate, loadRepairsByDate } from '../../actions/repair';
import ErrorPanel from '../../components/errorPanel';
import Dropdown from '../../components/dropdown';
import UserPicker from '../UserPicker';

class CreateRepair extends Component {
  static propTypes = {
    accountsIds: PropTypes.array.isRequired,
    repairsList: PropTypes.array.isRequired,
    repairsListLoading: PropTypes.bool.isRequired,
    getAllAccountsIdsNames: PropTypes.func.isRequired,
    repairCreate: PropTypes.func.isRequired,
    loadRepairsByDate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hour: '',
      date: null,
      userId: null,
      errorMessage: '',
      errorPanelShow: false,
      openDatePicker: false,
      openUserPicker: false,
    };

    this.saveRepair = this.saveRepair.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.onErrorPanelClose = this.onErrorPanelClose.bind(this);
    this.onDatePickerOpen = this.onDatePickerOpen.bind(this);
    this.onDatePickerClose = this.onDatePickerClose.bind(this);
    this.dropDownOnChange = this.dropDownOnChange.bind(this);

    this.onUserPickerOpen = this.onUserPickerOpen.bind(this);
    this.onUserPickerClose = this.onUserPickerClose.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.getDropDownOptions = this.getDropDownOptions.bind(this);
    props.getAllAccountsIdsNames();
  }

  saveRepair() {
    if (this.state.userId === null || this.state.date === null || this.state.hour === '' ||
      this.vehicle.value == null) {
      this.setState({
        errorMessage: 'All parameters are required',
        errorPanelShow: true,
      });
    } else {
      this.props.repairCreate(
        this.state.userId,
        this.state.date,
        this.state.hour,
        this.vehicle.value,
      );
    }
  }

  handleDayClick(day, props) {
    if (!props.disabled) {
      this.setState({ date: day });
      this.props.loadRepairsByDate(day);
    }
  }

  handleUserClick(user) {
    this.setState({ userId: user._id, openUserPicker: false });
  }

  onDatePickerOpen() {
    this.setState({ openDatePicker: true });
  }

  onDatePickerClose() {
    this.setState({ openDatePicker: false });
  }

  onUserPickerOpen() {
    this.setState({ openUserPicker: true });
  }

  onUserPickerClose() {
    this.setState({ openUserPicker: false });
  }

  onErrorPanelClose() {
    this.setState({ errorPanelShow: false });
  }

  dropDownOnChange({ value }) {
    this.setState({ hour: value });
  }

  getDropDownOptions() {
    const options = [];
    const stateDate = this.state.date;
    if (this.props.repairsListLoading || !stateDate) {
      return [{
        description: 'Loading...',
        code: '',
      }];
    }
    const repairsList = this.props.repairsList.filter(rep => (
      rep.date &&
      rep.date.getDate() === stateDate.getDate() &&
      rep.date.getMonth() === stateDate.getMonth() &&
      rep.date.getYear() === stateDate.getYear()
    )).map(rep => rep.hours);
    options.push({
      description: 'Select an Hour',
      code: '',
    });
    for (let i = 8; i <= 20; i += 1) {
      if (!repairsList.includes(i)) {
        options.push({
          description: i.toString(),
          code: i,
        });
      }
    }
    return options;
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

  render() {
    const options = this.getDropDownOptions();
    return (
      <div
        className="peb-center-ctn peb-create-repair"
      >
        <div className="row">
          <label htmlFor="vehicle">
            VIN:
          </label>
          <input
            type="text"
            className="peb-input peb-input-txt"
            id="vehicle"
            ref={(o) => { this.vehicle = o; }}
          />
        </div>

        <div className="row">
          <label htmlFor="OpenPicker">Date:</label>
          <button
            id="OpenPicker"
            className="peb-input"
            onClick={this.onDatePickerOpen}
          >
            {this.state.date === null ? 'Select Date' : (
              <div className="date">{this.state.date.toDateString()}</div>
            )}
          </button>
          <ReactModal
            isOpen={this.state.openDatePicker}
            className="peb-repair-panel"
            onRequestClose={this.onDatePickerClose}
            contentLabel="DatePickerPanel"
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            <DayPicker
              enableOutsideDays
              onDayClick={this.handleDayClick}
              disabledDays={{ before: new Date() }}
            />
          </ReactModal>
        </div>

        {this.state.date ? (
          <div className="row">
            <label htmlFor="myDropdownCreate">Available Hours:</label>
            <Dropdown
              id="myDropdownCreate"
              options={options}
              value={this.state.hour}
              labelField="description"
              valueField="code"
              onChange={this.dropDownOnChange}
            />
          </div>
        ) : null}

        <div className="row">
          <label htmlFor="userPicker">User:</label>
          <button
            id="userPicker"
            className="peb-input"
            onClick={this.onUserPickerOpen}
          >
            {this.state.userId === null ? 'Select User' : (
              <div className="user">{this.getUserName()}</div>
            )}
          </button>
          <UserPicker
            open={this.state.openUserPicker}
            onUserClick={this.handleUserClick}
            onClose={this.onUserPickerClose}
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
            onClick={this.saveRepair}
          >
            Create
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ account, accounts, repairs }) => ({
    account,
    accountsIds: accounts.accountsIds,
    repairsList: repairs.repairsList,
    repairsListLoading: repairs.repairsListLoading,
  }),
  dispatch => bindActionCreators({
    getAllAccountsIdsNames,
    loadRepairsByDate,
    repairCreate,
  }, dispatch),
)(CreateRepair);
