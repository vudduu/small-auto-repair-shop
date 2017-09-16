import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

import './dropdown.css';

class Dropdown extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.oneOfType(
      [
        PropTypes.number,
        PropTypes.string,
      ],
    ),
    valueField: PropTypes.string,
    labelField: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: -1,
    valueField: '',
    labelField: '',
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  // getInitialState() {
  //   const selected = this.getSelectedFromProps(this.props);
  //   return { selected };
  // }

  componentWillReceiveProps(nextProps) {
    const selected = this.getSelectedFromProps(nextProps);
    this.setState({ selected });
  }

  getSelectedFromProps(props) {
    let selected;
    if (props.value === null && props.options.length !== 0) {
      selected = props.options[0][props.valueField];
    } else {
      selected = props.value;
    }
    return selected;
  }

  handleChange(e) {
    if (this.props.onChange) {
      this.props.onChange({
        oldValue: this.state.selected,
        value: e.target.value,
      });
    }
    this.setState({ selected: e.target.value });
  }

  render() {
    const { value } = this.props;

    const options = this.props.options.map((option, i) => {
      const valueOp = option[this.props.valueField];
      const selected = valueOp === value || (i === 0 && value === -1);
      return (
        <option
          key={valueOp}
          value={valueOp}
          className={classNames({ selected })}
        >
          {option[this.props.labelField]}
        </option>
      );
    });

    return (
      <select
        id={this.props.id}
        className="form-control"
        value={this.state.selected}
        onChange={this.handleChange}
        disabled={options.length <= 1}
      >
        {options}
      </select>
    );
  }
}

export default Dropdown;
