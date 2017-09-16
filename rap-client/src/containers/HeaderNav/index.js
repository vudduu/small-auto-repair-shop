import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  NavLink,
  withRouter,
} from 'react-router-dom';
import './index.css';

class HeaderNav extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showMenu: true,
    };
  }

  menuOpen() {
    console.log('test');
  }

  getDefaultNavLinks() {
    return [{
      to: '/home',
      text: 'Home',
    }, {
      to: '/register',
      text: 'Register',
    }, {
      to: '/login',
      text: 'Login',
    }];
  }

  getLoggedNavLinks() {
    return [{
      to: '/home',
      text: 'Home',
    }];
  }

  render() {
    const navLinks = this.props.account.logged ? this.getLoggedNavLinks()
      : this.getDefaultNavLinks();
    return (
      <div className="responsive-nav">
        <span className="top-bar" />
        <nav
          className={classNames('nav', {
            'show-menu': this.state.showMenu,
          })}
        >
          {
            <ul>
              {navLinks.map(link => (
                <li
                  key={link.to}
                  className={classNames({
                    active: this.props.location.pathname === link.to,
                  })}
                >
                  <NavLink to={link.to}>{link.text}</NavLink>
                </li>
              ))}
            </ul>
          }
        </nav>
        <div className="mobile-header">
          Auto Repair Shop
          <span
            className="menu-btn"
            role="button"
            tabIndex="0"
            onClick={this.menuOpen}
          >
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" >
              <g><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></g>
            </svg>
          </span>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  ({ account }) => ({
    account,
  }),
  dispatch => bindActionCreators({
  }, dispatch),
)(HeaderNav));
