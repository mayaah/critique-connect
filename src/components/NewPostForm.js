import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { Checkbox, TextArea } from "@blueprintjs/core";
import Select from 'react-select';
import TextareaAutosize from 'react-autosize-textarea';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';

import { firebaseDB, base } from '../base'

class NewPostForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      comment: "",
      authorId: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : "",
      threadId: this.props.threadId,
    }
    this.threadRef = firebaseDB.database().ref(`Threads/${this.state.threadId}`);
    this.postsRef = firebaseDB.database().ref(`Posts`)
    this.userPostsRef = firebaseDB.database().ref(`/Users/${this.state.authorId}/Posts`)
    this.threadPostsRef = firebaseDB.database().ref(`Threads/${this.state.threadId}/Posts`)
    this.handleChange = this.handleChange.bind(this);
    this.submitPost = this.submitPost.bind(this);
  }

  componentWillMount() {
		
  }

  componentWillUnmount() {
  	this.threadRef.off()
    this.postsRef.off()
  }

  handleChange(event) {
    this.setState({ 
    	[event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  }

	simplifyDate(date) {
    let dateArray = date.split(" ")
    let dateOnly = dateArray.slice(1, 4)
    return dateOnly.join(" ")
  }

  submitPost(event) {
  	event.preventDefault()
    const post = {
      comment: this.state.comment,
      author: this.state.authorId,
      date: Date.now(),
      thread: this.state.threadId
    }
    var newPostRef = this.postsRef.push(post)
    var postId = newPostRef.key;
    this.addPostToUser(postId)
    this.threadPostsRef.update({
      [postId]: true
    })
    this.setState({
      comment: ""
    })
  }

  addPostToUser(postId) {
    this.userPostsRef.update({
      [postId] : true
    })
  }

  render() {

    return (
      <form onSubmit={(event) => this.submitPost(event)} ref={(form) => this.submitPostForm = form}>
        <TextArea className="review-textarea" large={true} value={this.state.comment} name="comment" onChange={this.handleChange} label="comment"/>
        <input type="submit" className="black-bordered-button" value="Submit Post"></input>
      </form>
    )
  }
}

export default NewPostForm
