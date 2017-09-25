/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DayPicker from 'react-day-picker';
import ReactModal from 'react-modal';
import halogen from 'halogen';

import 'react-day-picker/lib/style.css';
import './index.css';

import { getAllAccountsIdsNames } from '../../actions/account';
import { repairUpdate, loadRepairById, loadRepairsByDate } from '../../actions/repair';
import ErrorPanel from '../../components/errorPanel';
import Dropdown from '../../components/dropdown';
import UserPicker from '../UserPicker';

const Loader = halogen.RingLoader;

class UpdateRepair extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    accountsIds: PropTypes.array.isRequired,
    getAllAccountsIdsNames: PropTypes.func.isRequired,
    repairUpdate: PropTypes.func.isRequired,
    loadRepairById: PropTypes.func.isRequired,
    loadRepairsByDate: PropTypes.func.isRequired,

    hours: PropTypes.any,
    date: PropTypes.any,
    owner: PropTypes.string,
    vehicle: PropTypes.string,
    complete: PropTypes.number,
    repairsList: PropTypes.array.isRequired,
    repairsListLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    hours: '',
    date: null,
    owner: null,
    vehicle: '',
    complete: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      hour: props.hours,
      date: new Date(props.date),
      userId: props.owner,
      vehicle: props.vehicle,
      complete: props.complete,
      errorMessage: '',
      errorPanelShow: false,
      openDatePicker: false,
      openUserPicker: false,
    };
    this.changeComplete = this.changeComplete.bind(this);
    this.saveRepair = this.saveRepair.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.onErrorPanelClose = this.onErrorPanelClose.bind(this);
    this.onDatePickerOpen = this.onDatePickerOpen.bind(this);
    this.onDatePickerClose = this.onDatePickerClose.bind(this);
    this.dropDownOnChange = this.dropDownOnChange.bind(this);

    this.onUserPickerOpen = this.onUserPickerOpen.bind(this);
    this.onUserPickerClose = this.onUserPickerClose.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.inputUpdateVehicle = this.inputUpdateVehicle.bind(this);
    props.getAllAccountsIdsNames();
    props.loadRepairById(props.match.params.repairId);
    if (props.date) {
      this.props.loadRepairsByDate(new Date(props.date));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.owner && this.props.owner == null) {
      this.setState({
        hour: nextProps.hours,
        date: new Date(nextProps.date),
        userId: nextProps.owner,
        complete: nextProps.complete,
        vehicle: nextProps.vehicle,
      });
      this.props.loadRepairsByDate(new Date(nextProps.date));
    }
  }

  isSameDate(date1, date2) {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getYear() === date2.getYear();
  }

  saveRepair() {
    if (this.state.userId === null || this.state.date === null || this.state.hour === '' ||
      this.vehicle.value == null) {
      this.setState({
        errorMessage: 'All parameters are required',
        errorPanelShow: true,
      });
    } else {
      this.props.repairUpdate(
        this.props.match.params.repairId,
        this.state.userId,
        this.state.date,
        this.state.hour,
        this.state.complete,
        this.vehicle.value,
        this.props.account.role,
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
    const isSameDate = this.isSameDate(stateDate, this.props.date);
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
      if (!repairsList.includes(i) || (isSameDate && i === this.props.hours)) {
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

  inputUpdateVehicle() {
    this.setState({ vehicle: this.vehicle.value });
  }

  changeComplete() {
    this.setState({ complete: 1 - this.state.complete });
  }

  render() {
    if (this.props.repairsListLoading || !this.props.date) {
      return (
        <div className="peb-center-ctn peb-update-repair">
          <div className="hv-loading"><Loader color="#006494" /></div>
        </div>
      );
    }
    const options = this.getDropDownOptions();
    return (
      <div className="peb-center-ctn peb-update-repair">
        <div className="row">
          <label htmlFor="vehicle">
            VIN:
          </label>
          <input
            type="text"
            className="peb-input peb-input-txt"
            id="vehicle"
            value={this.state.vehicle}
            ref={(o) => { this.vehicle = o; }}
            onChange={this.inputUpdateVehicle}
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
              <div className="date">
                {this.state.date.toDateString && this.state.date.toDateString()}
              </div>
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
            <label htmlFor="myDropdownCreate">Hour:</label>
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

        <div className="div-group">
          <label htmlFor="completeControl">Complete:</label>
          <div className="complete-label">{this.state.complete === 1 ? 'True' : 'False'}</div>
          <button
            id="completeControl"
            className="peb-input"
            onClick={this.changeComplete}
          >
            {this.state.complete ? 'Incomplete' : 'Completed'}
          </button>
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
            Update
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ account, accounts, repairs }, { match }) => {
    const [repair] = repairs.repairsList.filter(rep => (
      rep._id === match.params.repairId
    ));
    const state = {
      account,
      accountsIds: accounts.accountsIds,
      repairsList: repairs.repairsList,
      repairsListLoading: repairs.repairsListLoading,
    };
    if (repair) return { ...state, ...repair };
    return state;
  },
  dispatch => bindActionCreators({
    getAllAccountsIdsNames,
    repairUpdate,
    loadRepairById,
    loadRepairsByDate,
  }, dispatch),
)(UpdateRepair);
