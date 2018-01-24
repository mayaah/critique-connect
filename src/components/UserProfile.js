import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';

import { firebaseDB, base } from '../base'

class UserProfile extends Component {
	constructor(props){
    super(props)
    this.state = {
    	userId: this.props.match.params.id,
    	displayName: "Staying Alive"
    }
  }

  componentDidMount() {
    firebaseDB.database().ref(`/Users/${this.state.userId}`).on('value', snapshot => {
    	this.setState({
    		displayName: snapshot.val().displayName
    	});
    });
  }


  render() {
    return (
    		<BrowserRouter>
    			<div style={{marginTop: "100px"}}>
    			<h1>{this.state.displayName}</h1>
    			</div>
    		</BrowserRouter>
    	);
  }
}

export default UserProfile;