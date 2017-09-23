/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './index.css';

import ButtonUser from './buttonUser';

class UserPicker extends Component {
  static propTypes = {
    userId: PropTypes.string,
    onClose: PropTypes.func,
    onUserClick: PropTypes.func,
    open: PropTypes.bool.isRequired,
    accountsIds: PropTypes.array.isRequired,
  };

  static defaultProps = {
    userId: '',
    onClose: () => {},
    onUserClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
    };
    this.onSelectUser = this.onSelectUser.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onSelectUser(user) {
    this.props.onUserClick(user);
  }

  onClose() {
    this.props.onClose();
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.open}
        className="peb-user-picker-panel"
        onRequestClose={this.onClose}
        contentLabel="UserPickerPanel"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <h3>Please pick a User</h3>
        {
          this.props.accountsIds.map(user => (
            <ButtonUser
              key={user._id}
              data={user}
              onClick={this.onSelectUser}
            />
          ))
        }
      </ReactModal>
    );
  }
}

export default connect(
  ({ accounts }) => ({
    accountsIds: accounts.accountsIds,
  }),
  dispatch => bindActionCreators({
  }, dispatch),
)(UserPicker);
