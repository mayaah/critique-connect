import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Header extends Component {
  render() {
    return (
     <nav className="pt-navbar pt-fixed-top">
        <div className="pt-navbar-group pt-align-left">
          {this.props.authenticated
              ? <input className="pt-input" placeholder="Search..." type="text" />
              : null
          }
        </div>
        {this.props.authenticated
            ? (
              <div className="pt-navbar-group pt-align-right">
                <span className="pt-navbar-divider"></span>
                <button className="pt-button pt-minimal pt-icon-user"></button>
                <button className="pt-button pt-minimal pt-icon-cog"></button>
                <Link className="pt-button pt-minimal pt-icon-log-out" aria-label="Log Out" to="/logout"></Link>
              </div>

            )
            : (
              <div className="pt-navbar-group pt-align-right">
                <Link className="pt-button pt-intent-primary" to="/login">Register/Log In</Link>
              </div>
            )
        }
      </nav>
    );
  }
}

export default Header;