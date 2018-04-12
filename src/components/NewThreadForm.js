import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { Checkbox, TextArea } from "@blueprintjs/core";
import Select from 'react-select';
import TextareaAutosize from 'react-autosize-textarea';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';

import { firebaseDB, base } from '../base'

class NewThreadForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      topic: "",
      comment: "",
      author: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : "",
      date: ""
    }
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.author}`)
    this.userPostsRef = firebaseDB.database().ref(`/Users/${this.state.author}/Posts`)
    this.userThreadsRef = firebaseDB.database().ref(`Users/${this.state.author}/Threads`)
    this.threadsRef = firebaseDB.database().ref(`/Threads`)
    this.postsRef = firebaseDB.database().ref(`/Posts`)
    this.handleChange = this.handleChange.bind(this);
    this.submitThread = this.submitThread.bind(this);
    this.addThreadToUser = this.addThreadToUser.bind(this);
    this.addPostToUser = this.addPostToUser.bind(this);
  }


  componentWillUnmount() {
  	this.userRef.off();
  	this.userPostsRef.off();
  	this.threadsRef.off();
  	this.postsRef.off();

  }

  handleChange(event) {
    this.setState({ 
    	[event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  }

  submitThread(event) {
  	event.preventDefault()
  	const thread = {
  		topic: this.state.topic,
  		author: this.state.author,
  		date: Date.now()
  	}
  	var newThreadRef = this.threadsRef.push(thread);
  	var threadId = newThreadRef.key;
  	this.addThreadToUser(threadId)
  	const post = {
  		comment: this.state.comment,
  		author: this.state.author,
  		date: Date.now(),
  		thread: threadId
  	}
  	var newPostRef = this.postsRef.push(post)
  	var postId = newPostRef.key;
  	this.addPostToUser(postId)
  	const threadPostsRef = firebaseDB.database().ref(`Threads/${threadId}/Posts`)
  	threadPostsRef.update({
  		[postId]: true
  	})
  	this.setState({ redirect: true })
  }

  createWIP(event) {
    event.preventDefault()
		const WIPsRef = firebaseDB.database().ref('WIPs');
	  const WIP = {
	    title: this.state.title,
	    writer: this.state.userId,
	    wc: this.state.wordCount,
	    logline: this.state.logline,
	    draft: this.state.draft,
	    language: this.state.language,
	    disclaimers: this.state.disclaimers,
	    improvementAreas: this.state.improvementAreas,
	    blurb: this.state.blurb,
	    additionalNotes: this.state.additionalNotes,
	    genres: this.state.genres.split(","),
	    types: this.state.genres.split(",")
	  }
	  var newWIPRef = WIPsRef.push(WIP);
	  var WIPId = newWIPRef.key;
    this.addWIPToUser(WIPId)
    this.WIPForm.reset()
    this.setState({ redirect: true })
  }

  addThreadToUser(threadId) {
  	this.userThreadsRef.update({
  		[threadId] : true
  	})
  }

  addPostToUser(postId) {
  	this.userPostsRef.update({
  		[postId] : true
  	})
  }

  render() {
  	if (this.state.redirect === true) {
      return <Redirect to= {{pathname: '/forum/'}} />
    }
    return (
    	<div>
	    	<BrowserRouter>
		      <Grid style={{marginTop: "100px"}}>
		      	<div className="form-name">New Thread</div>
		        <form className="center-form" onSubmit={(event) => this.submitThread(event)} ref={(form) => this.ThreadForm = form}>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">Topic</span>
		            <input className="pt-input input-field" value={this.state.topic} name="topic" type="text" onChange={this.handleChange} ></input>
		          </label>
		          <label className="pt-label form-field-box">
		          	<span className="label-field-name">Comment</span>
		          	<TextArea className="thread-textarea" large={true} value={this.state.comment} name="comment" onChange={this.handleChange} label="comment"/>
		          </label>	
		          <input type="submit" className="black-bordered-button" value="Submit Thread"></input>
		        </form>
		      </Grid>
	      </BrowserRouter>
      </div>
    )
  }
}

export default NewThreadForm