/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  NavLink,
} from 'react-router-dom';

import './index.css';

class RepairItem extends Component {
  static propTypes = {
    hideUpdateDelete: PropTypes.bool,
    onUpdateClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  };

  static defaultProps = {
    hideUpdateDelete: false,
  };

  constructor(props) {
    super(props);
    this.onUpdateClick = this.onUpdateClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onUpdateClick() {
    const repairM = this.props.data;
    if (this.props.onUpdateClick) {
      this.props.onUpdateClick(repairM);
    }
  }

  onDeleteClick() {
    const repairM = this.props.data;
    if (this.props.onDeleteClick) {
      this.props.onDeleteClick(repairM);
    }
  }

  onClick() {
    console.log(this.props.data._id);
  }

  getCompletedText() {
    const { data } = this.props;
    if (data.complete) {
      if (data.completeRole >= 3) {
        return 'Completed';
      }
      return 'Completed - not confirmed';
    }
    return 'Incomplete';
  }

  render() {
    const { data } = this.props;
    const date = data.date ? (new Date(data.date)).toDateString() : '';
    const label = this.getCompletedText();
    const hourFormat = data.hours <= 12 ? `${data.hours} AM` : `${data.hours - 12} PM`;
    return (
      <div className="peb-repair-item">
        <div className="peb-name">
          {data.vehicle}<br />
          {date} - {hourFormat} ({label})
        </div>
        <NavLink
          to={`/repair-view/${this.props.data._id}`}
        >
          Open
        </NavLink>
        {!this.props.hideUpdateDelete ? (
          <button onClick={this.onUpdateClick} >
            Update
          </button>
        ) : null}
        {!this.props.hideUpdateDelete ? (
          <button onClick={this.onDeleteClick} >
            Delete
          </button>
        ) : null}
      </div>
    );
  }
}

export default RepairItem;
