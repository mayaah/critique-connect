import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, OverlayTrigger, Label } from 'react-bootstrap';

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

class Header extends Component {

  render() {
    const betaTooltip = (
      <Tooltip id="tooltip">
        Much like your WIPs, this website is in beta! Please bear with us
        as we smooth out all the kinks and submit any feedback
        or bugs you find with the links at the bottom of the page!
      </Tooltip>
    );
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
              <OverlayTrigger placement="right" overlay={betaTooltip}>
                <Label 
                  className="looking-labels-small"
                  id="beta-tag"
                >
                  Beta
                </Label>
              </OverlayTrigger>
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
            <OverlayTrigger placement="right" overlay={betaTooltip}>
              <Label 
                className="looking-labels-small" 
                id="beta-tag"
              >
                Beta
              </Label>
            </OverlayTrigger>
          </div>
        )}
      </nav>
    );
  }
}

export default Header;
