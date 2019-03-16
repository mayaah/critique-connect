import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

class Header extends Component {

  render() {
    return (
      <nav className="pt-navbar pt-fixed-top">
        {this.props.authenticated ? (
          <div> 
            <div className="pt-navbar-group pt-align-left">
              <Link style={headerStyle} 
                    className="pt-navbar-heading" 
                    to="/homepage"
              >
                Critique Connect
              </Link>
            </div>
            <div className="pt-navbar-group pt-align-right">
            <span className="pt-navbar-divider"></span>
              <Link className="pt-button pt-minimal" to={"/search"}>
                Search
              </Link>
              <span className="pt-navbar-divider"></span>
              <Link className="pt-button pt-minimal" to={"/forum"}>
                Forum
              </Link>
              <span className="pt-navbar-divider"></span>
              <Link className="pt-button pt-minimal" to={"/user/"+this.props.currentUserId}>
                My Profile
              </Link>
              <span className="pt-navbar-divider"></span>
              <Link className="pt-button pt-minimal log-out-link" 
                    aria-label="Log Out" 
                    to="/logout"
              >
                Logout
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-navbar-group pt-align-left">
            <Link style={headerStyle} 
                  className="pt-navbar-heading" 
                  to="/"
            >
              Critique Connect
            </Link>
          </div>
        )}
      </nav>
    );
  }
}

export default Header;
