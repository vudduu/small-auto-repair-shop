import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

  render() {
    const { data } = this.props;
    const date = data.date ? (new Date(data.date)).toDateString() : '';
    const label = data.complete ? 'Completed' : 'Incomplete';
    const hourFormat = data.hours <= 12 ? `${data.hours} AM` : `${data.hours - 12} PM`;
    return (
      <div className="peb-repair-item">
        <div className="peb-name">
          {data.vehicle}<br />
          {date} - {hourFormat} ({label})
        </div>
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
