import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';

import { firebaseDB, base } from '../base'


class NewWIPForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      userId: this.props.match.params.userId
    }
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.userId}`)
    this.WIPsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/WIPs`)
  }

  componentWillMount() {
  	this.createWIP = this.createWIP.bind(this)
    this.addWIPToUser = this.addWIPToUser.bind(this)
  }

  componentWillUnmount() {
  	this.userRef.off();
  	this.WIPsRef.off();
  }

  createWIP(event) {
    event.preventDefault()
		const WIPsRef = firebaseDB.database().ref('WIPs');
	  const WIP = {
	    title: this.titleInput.value,
	    writer: this.state.userId
	  }
	  var newWIPRef = WIPsRef.push(WIP);
	  var WIPId = newWIPRef.key;
    this.addWIPToUser(WIPId)
    this.WIPForm.reset()
    this.setState({ redirect: true })
  }

  addWIPToUser(WIPId) {
    this.userRef.on('value', snapshot => {
      this.setState({
        displayName: snapshot.val().displayName
      });
    });
    this.WIPsRef.update({
      [WIPId]: true
    });
  }

  render() {
  	if (this.state.redirect === true) {
      return <Redirect to= {{pathname: '/user/' + this.state.userId}} />
    }
    return (
    	<div>
	    	<BrowserRouter>
		      <div style={{marginTop: "100px"}}>
		        <form onSubmit={(event) => this.createWIP(event)} ref={(form) => this.WIPForm = form}>
		          <label className="pt-label">
		            WIP Title
		            <input style={{width: "100%"}} className="pt-input" name="title" type="text" ref={(input) => { this.nameInput = input }} placeholder="Staying Alive"></input>
		          </label>
		          <input style={{width: "100%"}} type="submit" className="pt-button pt-intent-primary" value="Submit Work In Progress"></input>
		        </form>
		      </div>
	      </BrowserRouter>
      </div>
    )
  }
}

export default NewWIPForm