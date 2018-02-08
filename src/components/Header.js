import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseDB, base } from '../base';


class Header extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
     <nav className="pt-navbar pt-fixed-top">
     {this.props.authenticated
        ? (
        <div> 
          <div className="pt-navbar-group pt-align-left">
            <Link className="pt-navbar-heading" to="/homepage">Critique Connect</Link>
            {this.props.authenticated
                ? <input className="pt-input" placeholder="Search..." type="text" />
                : null
            }
          </div>
          <div className="pt-navbar-group pt-align-right">
            <span className="pt-navbar-divider"></span>
            <Link className="pt-button pt-minimal pt-icon-user" to={"/user/"+this.props.currentUserId}></Link>
            <button className="pt-button pt-minimal pt-icon-cog"></button>
            <Link className="pt-button pt-minimal pt-icon-log-out" aria-label="Log Out" to="/logout"></Link>
          </div>
        </div>
      )
      : null
        }
      </nav>
    );
  }
}

export default Header;