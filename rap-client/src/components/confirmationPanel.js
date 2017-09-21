import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
// import classNames from 'classnames';

import './confirmationPanel.css';

class ConfirmationPanel extends Component {
  static propTypes = {
    clickOnOption: PropTypes.func,
    textYes: PropTypes.string,
    textNo: PropTypes.string,
    children: PropTypes.any,
  };

  static defaultProps = {
    clickOnOption: () => {},
    textYes: '',
    textNo: '',
    children: {},
  };

  constructor(props) {
    super(props);
    this.clickOnYes = this.clickOnYes.bind(this);
    this.clickOnNo = this.clickOnNo.bind(this);
  }

  clickOnYes() {
    this.props.clickOnOption('yes');
  }

  clickOnNo() {
    this.props.clickOnOption('no');
  }

  render() {
    return (
      <ReactModal
        className="peb-confirmation-panel"
        clickOutside={this.clickOnNo}
      >
        {this.props.children}
        <div className="peb-buttons">
          <button onClick={this.clickOnYes} className="yes" >
            {this.props.textYes ? this.props.textYes : 'YES'}
          </button>
          <button onClick={this.clickOnNo} className="no" >
            {this.props.textNo ? this.props.textNo : 'NO'}
          </button>
        </div>
      </ReactModal>
    );
  }
}

export default ConfirmationPanel;
