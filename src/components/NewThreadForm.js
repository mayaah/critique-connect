import React, { Component } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { TextArea } from "@blueprintjs/core";
import { Grid } from 'react-bootstrap';
import { firebaseDB } from '../base';
import { convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

class NewThreadForm extends Component {
  constructor(props) {
    super(props)
    const content = {"entityMap":{},"blocks":[{"key":"637gr","text":"Initialized from content state.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
    this.state = {
      redirect: false,
      threadId: "",
      topic: "",
      pinned: false,
      comment: "",
      author: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : "",
      date: "",
      contentState: convertFromRaw(content),
    }
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.author}`)
    this.userPostsRef = firebaseDB.database().ref(`/Users/${this.state.author}/Posts`)
    this.userThreadsRef = firebaseDB.database().ref(`Users/${this.state.author}/Threads`)
    this.threadsRef = firebaseDB.database().ref(`/Threads`)
    this.postsRef = firebaseDB.database().ref(`/Posts`)
    this.handleChange = this.handleChange.bind(this);
    this.onContentStateChange = this.onContentStateChange.bind(this);
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

  onContentStateChange(contentState) {
    this.setState({
      contentState,
    });
  };

  submitThread(event) {
  	event.preventDefault()
    if (this.state.topic.length === 0 && this.state.contentState.length === 0) {
      alert("Topic and comment cannot be blank.")
      return false
    }
    if (this.state.topic.length === 0) {
      alert("Topic cannot be blank.")
      return false
    }
    if (this.state.contentState.length === 0) {
      alert("Comment cannot be blank.")
      return false
    }
  	const thread = {
  		topic: this.state.topic,
  		author: this.state.author,
  		date: Date.now(),
      pinned: false
  	}
  	var newThreadRef = this.threadsRef.push(thread);
  	var threadId = newThreadRef.key;
    this.setState({ threadId: threadId })
  	this.addThreadToUser(threadId)
  	const post = {
  		comment: JSON.stringify(convertToRaw(this.state.contentState.getCurrentContent())),
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
      return <Redirect to= {{pathname: '/thread/' + this.state.threadId}} />
    }
    return (
    	<div>
	    	<BrowserRouter>
		      <Grid style={{ marginTop: "100px" }}>
		      	<div className="form-name">
              New Thread
            </div>
		        <form 
              className="center-form" 
              onSubmit={(event) => this.submitThread(event)} 
              ref={(form) => this.ThreadForm = form}
            >
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">
                  Topic
                </span>
		            <input 
                  className="pt-input input-field" 
                  value={this.state.topic} 
                  name="topic" 
                  type="text" 
                  onChange={this.handleChange}
                >
                </input>
		          </label>
		          <label className="pt-label form-field-box">
		          	<span className="label-field-name">
                  Comment
                </span>
                <Editor
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor"
                  onEditorStateChange={this.onContentStateChange}
                />
		          </label>	
		          <button 
                type="submit" 
                className="black-bordered-button" 
              >
                Submit Thread
              </button>
		        </form>
		      </Grid>
	      </BrowserRouter>
      </div>
    )
  }
}

export default NewThreadForm;
