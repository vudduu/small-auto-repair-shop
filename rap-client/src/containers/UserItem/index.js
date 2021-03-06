import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './index.css';

import LocalizedStrings from '../../localizations/LocalizedStrings';

class UserItem extends Component {
  static propTypes = {
    onOpenRepairsClick: PropTypes.func.isRequired,
    onUpdateClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.openRepairsClick = this.openRepairsClick.bind(this);
    this.onUpdateClick = this.onUpdateClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  openRepairsClick() {
    const userM = this.props.data;
    if (this.props.onOpenRepairsClick) {
      this.props.onOpenRepairsClick(userM);
    }
  }

  onUpdateClick() {
    const userM = this.props.data;
    if (this.props.onUpdateClick) {
      this.props.onUpdateClick(userM);
    }
  }

  onDeleteClick() {
    const userM = this.props.data;
    if (this.props.onDeleteClick) {
      this.props.onDeleteClick(userM);
    }
  }

  render() {
    const { data } = this.props;
    const name = data.name;
    const role = LocalizedStrings.getString(`account_role.${data.role}`);
    return (
      <div className="peb-user-item">
        <div className="peb-name">
          {name} ({role})
        </div>
        <button onClick={this.openRepairsClick} >
          Open Repairs List
        </button>
        <button onClick={this.onUpdateClick} >
          Update
        </button>
        <button onClick={this.onDeleteClick} >
          Delete
        </button>
      </div>
    );
  }
}

export default UserItem;
