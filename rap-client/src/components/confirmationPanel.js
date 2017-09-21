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
    open: PropTypes.bool,
  };

  static defaultProps = {
    clickOnOption: () => {},
    textYes: '',
    textNo: '',
    children: {},
    open: false,
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
        isOpen={this.props.open}
        className="peb-confirmation-panel"
        onRequestClose={this.clickOnNo}
        contentLabel="ConfirmationPanel"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
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
