import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DayPicker from 'react-day-picker';
import ReactModal from 'react-modal';

import './filterDateRange.css';

class FilterDateRange extends Component {
  static propTypes = {
    onNewFilter: PropTypes.func,
    dateFrom: PropTypes.any,
    dateTo: PropTypes.any,
  };

  static defaultProps = {
    onNewFilter: () => {},
    dateFrom: new Date(),
    dateTo: new Date(),
  };

  constructor(props) {
    super(props);
    this.state = {
      dateFrom: props.dateFrom || null,
      dateTo: props.dateTo || null,
      lastDateSelector: 0,
    };
    this.openDaySelector1 = this.openDaySelector.bind(this, 1);
    this.openDaySelector2 = this.openDaySelector.bind(this, 2);
    this.closeDaySelector = this.closeDaySelector.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
  }

  openDaySelector(val) {
    this.setState({ lastDateSelector: val });
  }

  handleDayClick(day) {
    const obj = {
      dateFrom: this.state.dateFrom,
      dateTo: this.state.dateTo,
    };
    if (this.state.lastDateSelector === 1) {
      obj.dateFrom = day;
    } else {
      obj.dateTo = day;
    }
    if (obj.dateFrom && obj.dateTo) {
      if (obj.dateFrom > obj.dateTo) {
        const aux = obj.dateFrom;
        obj.dateFrom = obj.dateTo;
        obj.dateTo = aux;
      }
    }
    this.setState({ ...obj, lastDateSelector: 0 });
    this.props.onNewFilter(obj);
  }

  closeDaySelector() {
    this.setState({ lastDateSelector: 0 });
  }

  render() {
    return (
      <div className="peb-filter-date-range">
        <div className="left">
          <label htmlFor="OpenPicker1">Date from:</label>
          <button
            id="OpenPicker1"
            className="peb-input peb-input-date"
            onClick={this.openDaySelector1}
          >
            {this.state.dateFrom === null ? 'Select Date' : (
              <div className="date-from">
                {this.state.dateFrom.toDateString()}
              </div>
            )}
          </button>
        </div>
        <div className="right">
          <label htmlFor="OpenPicker2">Date to:</label>
          <button
            id="OpenPicker2"
            className="peb-input peb-input-date"
            onClick={this.openDaySelector2}
          >
            {this.state.dateTo === null ? 'Select Date' : (
              <div className="date-from">
                {this.state.dateTo.toDateString()}
              </div>
            )}
          </button>
        </div>
        <div className="peb-clear" />
        {this.state.lastDateSelector !== 0 ? (
          <ReactModal
            isOpen
            className="peb-modal-day-selector"
            onRequestClose={this.closeDaySelector}
            contentLabel="DateFilterPickerPanel"
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            <DayPicker
              enableOutsideDays
              onDayClick={this.handleDayClick}
            />
          </ReactModal>
        ) : null}
      </div>
    );
  }
}

export default FilterDateRange;
