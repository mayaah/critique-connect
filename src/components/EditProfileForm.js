import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { Checkbox, TextArea } from "@blueprintjs/core";

import { firebaseDB, base } from '../base'

class EditProfileForm extends Component {
	constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      userId: this.props.currentUserId,
      currentUser: firebaseDB.auth().currentUser,
      displayName: "",
      lfr: false,
      ltr: false,
      bio: "",
      location: "",
      occupation: "",
      website: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.currentUser.uid}`)
  }

  handleChange(event) {
  	console.log(event.target.name)
    console.log(event.target.value)
    this.setState({ 
    	[event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  }

  componentDidMount() {
    this.userRef.on('value', snapshot => {
    	let currentUser = snapshot.val()
      this.setState({
        displayName: currentUser.displayName,
	      lfr: currentUser.lfr,
	      ltr: currentUser.ltr,
	      bio: currentUser.bio ? currentUser.bio : "",
	      location: currentUser.location ? currentUser.location : "",
	      occupation: currentUser.occupation ? currentUser.occupation : "",
	      website: currentUser.website ? currentUser.website : ""
      });
    });
  }

  componentWillUnmount() {
		this.userRef.off();
  }

  updateUserProfile(event) {
    event.preventDefault()
	  this.userRef.update({
      displayName: this.state.displayName,
	    lfr: this.state.lfr,
	    ltr: this.state.ltr,
	    bio: this.state.bio,
	    location: this.state.location,
	    occupation: this.state.occupation,
	    website: this.state.website
    });
    this.EditProfileForm.reset()
    this.setState({ redirect: true })
  }

  render() {
  	if (this.state.redirect === true) {
      return <Redirect to= {{pathname: '/user/' + this.state.currentUser.uid}} />
    }
    return (
    	<div>
	    	<BrowserRouter>
		      <div style={{marginTop: "100px"}}>
		        <form onSubmit={(event) => this.updateUserProfile(event)} ref={(form) => this.EditProfileForm = form}>
		          <label className="pt-label">
		            Name
		            <input className="pt-input" value={this.state.displayName} name="displayName" onChange={this.handleChange} type="text" placeholder={this.state.displayName} ></input>
		          </label>
	            <Checkbox checked={this.state.lfr} value={this.state.lfr} name="lfr" onChange={this.handleChange} label="Is Looking For Reader" />
	            <Checkbox checked={this.state.ltr} value={this.state.ltr} name="ltr" onChange={this.handleChange} label="Is Looking To Read" />
	            <label className="pt-label"> 
	            	Bio 
		            <TextArea large={true} value={this.state.bio} name="bio" onChange={this.handleChange} label="Bio" />
							</label>
							<label className="pt-label">
		            Location
		            <input className="pt-input" value={this.state.location} name="location" onChange={this.handleChange} type="text" ></input>
		          </label>
		          <label className="pt-label">
		            Occupation
		            <input className="pt-input" value={this.state.occupation} name="occupation" onChange={this.handleChange} type="text" ></input>
		          </label>
		          <label className="pt-label">
		            Website
		            <input className="pt-input" value={this.state.website} name="website" onChange={this.handleChange} type="url" ></input>
		          </label>
		          <input type="submit" className="pt-button pt-intent-primary" value="Save"></input>
		        </form>
		      </div>
	      </BrowserRouter>
      </div>
    )
  }
}

export default EditProfileForm