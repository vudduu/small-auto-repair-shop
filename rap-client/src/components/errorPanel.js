import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
// import classNames from 'classnames';

import './errorPanel.css';

class ErrorPanel extends Component {
  static propTypes = {
    clickOk: PropTypes.func,
    onClose: PropTypes.func,
    textOk: PropTypes.string,
    children: PropTypes.any,
    show: PropTypes.bool,
  };

  static defaultProps = {
    show: false,
    clickOk: () => {},
    onClose: () => {},
    textOk: '',
    children: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.clickOk = this.clickOk.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show && nextProps.show !== this.props.show) {
      this.setState({ show: true });
    }
  }

  clickOk() {
    if (this.props.clickOk) this.props.clickOk();
    this.handleCloseModal();
  }

  handleCloseModal() {
    this.setState({ show: false });
    this.props.onClose();
  }

  render() {
    if (!this.state.show) return null;
    return (
      <ReactModal
        isOpen={this.state.show}
        className="modal-div"
        onRequestClose={this.handleCloseModal}
        contentLabel="ErrorPanel"
      >
        <div className="peb-error-panel">
          {this.props.children}
          <div className="peb-buttons">
            <button onClick={this.clickOk} className="ok" >
              {this.props.textOk ? this.props.textOk : 'OK'}
            </button>
          </div>
        </div>
      </ReactModal>
    );
  }
}

export default ErrorPanel;
