import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseDB, base } from '../base';


class Header extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentUserId: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : ""
    }
  }

  render() {
    return (
     <nav className="pt-navbar pt-fixed-top">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">Critique Connect</div>
          {this.props.authenticated
              ? <input className="pt-input" placeholder="Search..." type="text" />
              : null
          }
        </div>
        {this.props.authenticated
            ? (
              <div className="pt-navbar-group pt-align-right">
                <span className="pt-navbar-divider"></span>
                <Link className="pt-button pt-minimal pt-icon-user" to={"/user/"+this.state.currentUserId}></Link>
                <button className="pt-button pt-minimal pt-icon-cog"></button>
                <Link className="pt-button pt-minimal pt-icon-log-out" aria-label="Log Out" to="/logout"></Link>
              </div>
            )
            : null
        }
      </nav>
    );
  }
}

export default Header;