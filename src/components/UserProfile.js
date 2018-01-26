import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import NewWIPForm from './NewWIPForm';

import { firebaseDB, base } from '../base'

class UserProfile extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirect: false,
      userId: this.props.match.params.id,
      displayName: ""
    }
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.userId}`)
  }

  componentWillMount() {
    this.userRef.on('value', snapshot => {
      this.setState({
        displayName: snapshot.val().displayName
      });
    });
  }

  componentWillUnmount() {
    this.userRef.off();
  }

  render() {
    return (
        <div style={{marginTop: "100px"}}>
          <h1>{this.state.displayName}</h1>
          <Link className="pt-button" aria-label="Log Out" to={"/submit_wip/"+this.state.userId} >Submit a Work in Progress</Link>
        </div>
      );
  }
}

export default UserProfile;