import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
// import classNames from 'classnames';

class ErrorPanel extends Component {
  static propTypes = {
    clickOk: PropTypes.func,
    textOk: PropTypes.string,
    children: PropTypes.any,
  };

  static defaultProps = {
    clickOk: () => {},
    textOk: '',
    children: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.clickOk = this.clickOk.bind(this);
  }

  show() {
    this.setState({ show: true });
  }

  clickOk() {
    if (this.props.clickOk) this.props.clickOk();
    this.setState({ show: false });
  }

  handleCloseModal() {
    this.setState({ show: false });
  }

  render() {
    if (!this.state.show) return null;
    return (
      <ReactModal
        isOpen={this.state.show}
        className="modal"
        onRequestClose={this.handleCloseModal}
      >
        {this.props.children}
        <div className="peb-buttons">
          <button onClick={this.clickOk} className="ok" >
            {this.props.textOk ? this.props.textOk : 'OK'}
          </button>
        </div>
      </ReactModal>
    );
  }
}

export default ErrorPanel;
