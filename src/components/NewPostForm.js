import React, { Component } from 'react';
import { TextArea } from "@blueprintjs/core";
import { firebaseDB } from '../base';
import { convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

class NewPostForm extends Component {
  constructor(props) {
    super(props)
    const content = {"entityMap":{},"blocks":[{"key":"637gr","text":"Initialized from content state.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
    this.state = {
      redirect: false,
      comment: "",
      authorId: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : "",
      threadId: this.props.threadId,
      contentState: convertFromRaw(content),
    }
    this.threadRef = firebaseDB.database().ref(`Threads/${this.state.threadId}`);
    this.postsRef = firebaseDB.database().ref(`Posts`)
    this.userPostsRef = firebaseDB.database().ref(`/Users/${this.state.authorId}/Posts`)
    this.threadPostsRef = firebaseDB.database().ref(`Threads/${this.state.threadId}/Posts`)
    this.handleChange = this.handleChange.bind(this);
    this.submitPost = this.submitPost.bind(this);
    this.onContentStateChange = this.onContentStateChange.bind(this);
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

  onContentStateChange(contentState) {
    this.setState({
      contentState,
    });
  };


	simplifyDate(date) {
    let dateArray = date.split(" ")
    let dateOnly = dateArray.slice(1, 4)
    return dateOnly.join(" ")
  }

  submitPost(event) {
    const content = {"entityMap":{},"blocks":[{"key":"637gr","text":"Initialized from content state.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
    // event.preventDefault()
    if (this.state.contentState.length === 0) {
      alert("Post cannot be blank.")
      return false
    }
    const post = {
      comment: JSON.stringify(convertToRaw(this.state.contentState.getCurrentContent())),
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
      comment: "",
      contentState: convertFromRaw(content),
    })
  }

  addPostToUser(postId) {
    this.userPostsRef.update({
      [postId] : true
    })
  }

  render() {

    return (
      <form onSubmit={(event) => this.submitPost(event)} 
            ref={(form) => this.submitPostForm = form}
      >
        <Editor
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onContentStateChange}
        />
        <button 
          type="submit" 
          className="black-bordered-button" 
        >
          Submit Post
        </button>
      </form>
    )
  }
}

export default NewPostForm;
