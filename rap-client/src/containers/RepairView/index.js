/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import halogen from 'halogen';

import 'react-day-picker/lib/style.css';
import './index.css';

import { getAllAccountsIdsNames } from '../../actions/account';
import { repairUpdate, loadRepairById, loadRepairsByDate, addCommentRepair } from '../../actions/repair';
import ErrorPanel from '../../components/errorPanel';

import { MANAGER } from '../../reducers/account';

const Loader = halogen.RingLoader;

class RepairView extends Component {
  static propTypes = {
    accountsIds: PropTypes.array.isRequired,
    account: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    getAllAccountsIdsNames: PropTypes.func.isRequired,
    repairUpdate: PropTypes.func.isRequired,
    loadRepairById: PropTypes.func.isRequired,
    loadRepairsByDate: PropTypes.func.isRequired,
    addCommentRepair: PropTypes.func.isRequired,

    _id: PropTypes.string.isRequired,
    hours: PropTypes.any,
    date: PropTypes.any,
    owner: PropTypes.string,
    vehicle: PropTypes.string,
    complete: PropTypes.number,
    completeRole: PropTypes.number,
    comments: PropTypes.array,
    repairsListLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    _id: '',
    hours: '',
    date: null,
    owner: null,
    vehicle: '',
    complete: 0,
    completeRole: 0,
    comments: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      complete: props.complete,
      errorMessage: '',
      errorPanelShow: false,
      openDatePicker: false,
      openUserPicker: false,
    };
    this.changeComplete = this.changeComplete.bind(this);
    this.saveRepair = this.saveRepair.bind(this);
    this.onErrorPanelClose = this.onErrorPanelClose.bind(this);
    this.addComment = this.addComment.bind(this);
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

  saveRepair() {
    this.props.repairUpdate(
      this.props.match.params.repairId,
      this.props.owner,
      this.props.date,
      this.props.hours,
      this.state.complete,
      this.props.vehicle,
    );
  }

  onErrorPanelClose() {
    this.setState({ errorPanelShow: false });
  }

  getUserName() {
    return this.props.account.name;
  }

  changeComplete() {
    this.setState({ complete: 1 - this.state.complete });
  }

  addComment() {
    this.props.addCommentRepair(this.props._id, this.comment.value);
    this.comment.value = '';
  }

  completedText() {
    if (this.state.complete === 1) {
      if (this.props.completeRole && this.props.completeRole >= 3) {
        return 'True by manager';
      }
      return 'True by user';
    }
    return 'False';
  }

  render() {
    if (this.props.repairsListLoading || !this.props.date) {
      return (
        <div className="peb-center-ctn peb-update-repair">
          <div className="hv-loading"><Loader color="#006494" /></div>
        </div>
      );
    }
    return (
      <div className="peb-center-ctn peb-repair-view">
        <div className="row">
          <div className="left">VIN:</div>
          <div className="right">{this.props.vehicle}</div>
        </div>
        <div className="row">
          <div className="left">Date:</div>
          <div className="right">
            {this.props.date.toDateString && this.props.date.toDateString()}
          </div>
        </div>
        <div className="row">
          <div className="left">Hour:</div>
          <div className="right">{this.props.hours}</div>
        </div>
        <div className="row">
          <div className="left">User:</div>
          <div className="right">{this.getUserName()}</div>
        </div>

        <div className="div-group">
          <div className="left">Complete:</div>
          <div className="right">{this.completedText()}</div>
        </div>

        {this.props.complete === 0 ? (
          <div className="row">
            <button
              className="peb-input"
              onClick={this.changeComplete}
            >
              {this.state.complete ? 'Incomplete' : 'Completed'}
            </button>
            <button
              className="peb-input create-button"
              onClick={this.saveRepair}
            >
              Update
            </button>
          </div>
        ) : null}
        {this.props.complete === 1 && this.props.account.role >= MANAGER ? (
          <div className="row">
            <button
              className="peb-input create-button"
              onClick={this.saveRepair}
            >
              CONFIRM
            </button>
          </div>
        ) : null}

        <div className="peb-repair-comments">
          <h2>Comments</h2>
          {this.props.comments.length === 0 ? null : (
            <div className="list">
              {this.props.comments.map((comment) => {
                const options = {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                };
                const date = (new Date(comment.date)).toLocaleTimeString('en-us', options);
                const [user] = this.props.accountsIds.filter(account => (
                  account._id === comment.user
                ));
                const name = user ? user.name : 'manager';
                return (
                  <div key={comment.date}>
                    <b>{name}:</b> {comment.text}
                    <span className="date-time">{date}</span>
                  </div>
                );
              })}
            </div>
          )}
          <label htmlFor="comment">New Comment:</label><br />
          <input
            className="peb-input peb-input-txt"
            type="text"
            id="comment"
            ref={(o) => { this.comment = o; }}
          />
          <button
            className="peb-input peb-comment"
            onClick={this.addComment}
          >
            ADD
          </button>
        </div>

        <ErrorPanel
          show={this.state.errorPanelShow}
          onClose={this.onErrorPanelClose}
        >
          {this.state.errorMessage}
        </ErrorPanel>
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
    addCommentRepair,
  }, dispatch),
)(RepairView);
