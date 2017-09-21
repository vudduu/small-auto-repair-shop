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
import { logoutAccount } from '../../actions/account';

let tabIndex = 0;

class HeaderNav extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    logoutAccount: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showMenu: true,
    };
    this.doLogout = this.doLogout.bind(this);
    this.createLink = this.createLink.bind(this);
  }

  menuOpen() {
    console.log('test');
  }

  doLogout() {
    this.props.logoutAccount();
    this.props.history.push('/home');
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
      show: true,
    }, {
      to: '/users-list',
      text: 'Users',
      show: this.props.account && this.props.account.role > 2,
    }, {
      to: '/register',
      text: 'Create Account',
      show: this.props.account && this.props.account.role > 2,
    }, {
      text: 'Logout',
      onClick: this.doLogout,
      show: true,
    }].filter(o => o.show);
  }

  createLink(link) {
    if (link.onClick) {
      tabIndex += 1;
      return (
        <li key={link.text} >
          <a
            onClick={link.onClick}
            role="button"
            tabIndex={tabIndex}
          >
            {link.text}
          </a>
        </li>
      );
    }
    const active = this.props.location.pathname === link.to;
    return (
      <li
        key={link.to}
        className={classNames({ active })}
      >
        <NavLink
          to={link.to}
          replace={active}
        >
          {link.text}
        </NavLink>
      </li>
    );
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
          <ul>
            {navLinks.map(link => this.createLink(link))}
          </ul>
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
    logoutAccount,
  }, dispatch),
)(HeaderNav));
