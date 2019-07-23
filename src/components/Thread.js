import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import NewPostForm from './NewPostForm'
import { Grid, Row, Col, Image, Button } from 'react-bootstrap';
import { TextArea } from "@blueprintjs/core";
import Pagination from "react-js-pagination";
import * as constants from '../constants';
import { firebaseDB } from '../base'
import update from 'immutability-helper';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';

class Thread extends Component {
	constructor(props){
    super(props)
    this.state = {
      redirect: false,
      currentUserId: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : "",
      threadId: this.props.match.params.threadId,
      author: "",
      topic: "",
      posts: [],
      pinned: false,
      currentPosts: [],
      activePage: 1,
      editingTopic: false,
      doesNotExist: false
    }
    this.threadRef = firebaseDB.database().ref(`Threads/${this.state.threadId}`);
    this.postsRef = firebaseDB.database().ref(`Threads/${this.state.threadId}/Posts`)
    this.simplifyDate = this.simplifyDate.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.loadPosts = this.loadPosts.bind(this);
    this.editPost = this.editPost.bind(this);
    this.savePost = this.savePost.bind(this);
    this.isJson = this.isJson.bind(this);
    this.onContentStateChange = this.onContentStateChange.bind(this);
  }

  componentWillUnmount() {
    this.threadRef.off()
    this.postsRef.off()
  }

  componentDidMount() {
    window.scrollTo(0,0);
    this.threadRef.on('value', snapshot => {
      let thread = snapshot.val()
      if (thread) {
        this.setState({
          topic: thread.topic ? thread.topic : "",
          author: thread.author ? thread.author : "",
        });
        this.loadPosts();
      } else {
        this.setState({doesNotExist: true})
      }
    })
  }

  componentDidUpdate(nextProps) {
    if (nextProps.match.params.threadId !== this.props.match.params.threadId) {
      window.scrollTo(0,0);
    }
  }

  isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true && isNaN(parseInt(str));
  }

  loadPosts() {
    this.postsRef.on('value', snapshot => {
      let posts = snapshot.val();
      let newState = [];
      let promises = [];
      for (let post in posts) {
        var postRef = firebaseDB.database().ref(`/Posts/${post}`)
        promises.push(postRef.once('value')); 
      }
      Promise.all(promises).then((snapshots) => {
        snapshots.forEach((snapshot) => {
          var post = snapshot.val()
          let postAuthorName = ""
          let postAuthorAvatar = ""
          if (post.author === constants.DELETED_STRING) {
            let postComment = EditorState.createEmpty()
            if (this.isJson(post.comment))
              postComment = post.comment
            else
              postComment = JSON.stringify(convertToRaw(ContentState.createFromText(post.comment)))
            newState.push({
              id: snapshot.key,
              authorId: null,
              author: constants.DELETED_STRING,
              authorAvatar: constants.DEFAULT_AVATAR_URL,
              comment: EditorState.createWithContent(convertFromRaw(JSON.parse(postComment))),
              date: post.date,
              editing: false,
              editedPostDate: post.editedPostDate ? post.editedPostDate : ""
            });
            var sortedArr = newState.sort(function(a, b) {
              var keyA = new Date(a.date),
                  keyB = new Date(b.date);
              // Compare the 2 dates
              if(keyA < keyB) return -1;
              if(keyA > keyB) return 1;
              return 0;
            });
            console.log(sortedArr)
            this.setState({
              posts: sortedArr,
              currentPosts: sortedArr.slice(0, 20)
            });
          } else {
            var postAuthorRef = firebaseDB.database().ref(`/Users/${post.author}`)
            postAuthorRef.once('value', snapshot2 => {
              let postAuthor = snapshot2.val();
              postAuthorName = postAuthor.displayName
              postAuthorAvatar = postAuthor.avatarURL ? postAuthor.avatarURL : constants.DEFAULT_AVATAR_URL
              let postComment = EditorState.createEmpty()
              if (this.isJson(post.comment))
                postComment = post.comment
              else
                postComment = JSON.stringify(convertToRaw(ContentState.createFromText(post.comment)))
              newState.push({
                id: snapshot.key,
                authorId: post.author,
                author: postAuthorName,
                authorAvatar: postAuthorAvatar,
                comment: EditorState.createWithContent(convertFromRaw(JSON.parse(postComment))),
                date: post.date,
                editing: false,
                editedPostDate: post.editedPostDate ? post.editedPostDate : ""
              });
              var sortedArr = newState.sort(function(a, b) {
                var keyA = new Date(a.date),
                    keyB = new Date(b.date);
                // Compare the 2 dates
                if(keyA < keyB) return -1;
                if(keyA > keyB) return 1;
                return 0;
              });
              console.log(sortedArr)
              this.setState({
                posts: sortedArr,
                currentPosts: sortedArr.slice(0, 20)
              });
            })
          }
        });
      });
    });
  }

  simplifyDate(date) {
    let dateArray = date.split(" ")
    let dateOnly = dateArray.slice(1, 4)
    return dateOnly.join(" ")
  }

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({
      activePage: pageNumber,
      currentPosts: this.state.posts.slice((pageNumber - 1) * 20, (pageNumber - 1) * 20 + 20)
    });
  }

  editPost(postId) {
    var existingPosts = this.state.currentPosts
    var postIndex = existingPosts.findIndex(function(p) { 
        return p.id === postId;
    });
    var updatedPost = update(existingPosts[postIndex], {editing: {$set: true}});
    var newData = update(existingPosts, {
        $splice: [[postIndex, 1, updatedPost]]
    });
    this.setState({currentPosts: newData}); 
  }

  onContentStateChange(postId, contentState) {
    var existingPosts = this.state.currentPosts
    var ref = 'newPost' + postId
    var newComment = this.refs[ref].getEditorState()
    var postIndex = existingPosts.findIndex(function(p) { 
        return p.id === postId;
    });
    var updatedPost = update(existingPosts[postIndex], {comment: {$set: contentState}});
    var newData = update(existingPosts, {
        $splice: [[postIndex, 1, updatedPost]]
    });
    this.setState({currentPosts: newData});
  };

  savePost(postId) {
    var existingPosts = this.state.currentPosts
    // var stringPostId = postId.replace(/[^a-zA-Z ]/g, "")
    var ref = 'newPost' + postId
    var newComment = this.refs[ref].getEditorState()
    // var newComment = JSON.stringify(convertToRaw(this.refs[ref].value.getCurrentContent()));
    if (newComment.length < 1) {
      alert("Comment cannot be blank.")
      return false
    }
    var postIndex = existingPosts.findIndex(function(p) { 
        return p.id === postId;
    });
    var updatedPost = update(existingPosts[postIndex], {editing: {$set: false}, comment: {$set: newComment}});
    var newData = update(existingPosts, {
        $splice: [[postIndex, 1, updatedPost]]
    });
    firebaseDB.database().ref(`/Posts/${postId}`).update({
      comment: JSON.stringify(convertToRaw(newComment.getCurrentContent())),
      editedPostDate: Date.now()
    })
    this.setState({currentPosts: newData});
  }

  editTitle(threadId) {
    this.setState({editingTopic: true})
  }

  saveTitle(threadId) {
    var ref = 'newTopic' + threadId
    var newTopic = this.refs[ref].value;
    if (newTopic.length < 1) {
      alert("Topic cannot be blank.")
      return false
    }
    firebaseDB.database().ref(`/Threads/${threadId}`).update({
      topic: newTopic
    })
    this.setState({
      topic: newTopic,
      editingTopic: false
    })
  }

	render() {
    if (this.state.doesNotExist === true) {
      return <Redirect to= {{pathname: '/not_found'}} />
    }
    
    return (
	  	<Grid style={{marginTop: "100px"}}>
        <Row className="forum-header">
          <Col sm={12}>
            {this.state.editingTopic ? (
              <div>
                <textarea ref={"newTopic" + this.state.threadId} defaultValue={this.state.topic}></textarea>
                <Button
                    type='button'
                    className="black-bordered-button"
                    onClick={() => this.saveTitle(this.state.threadId)}
                  >
                    Save Title
                </Button>
              </div>
            ) : (
              <div>
                <div className="page-name">
                  {this.state.topic}
                </div>
                {this.state.author === this.state.currentUserId && (
                  <Button
                    type='button'
                    className="black-bordered-button"
                    onClick={() => this.editTitle(this.state.threadId)}
                  >
                    Edit Title
                  </Button>
                )}
              </div>
            )}
          </Col>
        </Row>
        <div className="posts">
          {this.state.currentPosts.map((post) => {
            return (
              <Row className="post flex" key={post.id}>
                <Col sm={2}>
                  <Link to={"/user/" + post.authorId}>
                    <div className="post-author-name">
                      {post.author}
                    </div>
                    <div className="post-author-avatar-container">
                      <Image 
                        className="post-author-avatar" 
                        src={post.authorAvatar} 
                        responsive 
                      />
                    </div>
                  </Link>
                  <div className="post-date">
                    {this.simplifyDate(new Date(post.date).toUTCString())}
                  </div>
                  {post.editedPostDate && (
                    <div className="post-date">
                      Edited: {this.simplifyDate(new Date(post.editedPostDate).toUTCString())}
                    </div>
                  )}
                </Col>
                <Col sm={10}>
                  {post.editing ? (
                    <div>
                      <Editor
                        ref={"newPost" + post.id}
                        editorState={post.comment}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={(e) => {this.onContentStateChange(post.id, e)}}
                      />
                      <Button 
                          type='button'
                          className="black-bordered-button"
                          onClick={() => this.savePost(post.id)}
                        >
                          Save Post
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="post-comment">
                        <div dangerouslySetInnerHTML={{ __html: draftToHtml(convertToRaw(post.comment.getCurrentContent())) }}/>
                      </div>
                      {post.authorId === this.state.currentUserId && (
                        <Button 
                          type='button'
                          className="black-bordered-button"
                          onClick={() => this.editPost(post.id)}
                        >
                          Edit Post
                        </Button>
                      )}
                    </div>
                  )}
                </Col>
              </Row>
            )
          })}
        </div>
        <Row>
          <Col sm={12}>
            <NewPostForm threadId={this.state.threadId} /> 
          </Col>
        </Row> 
        <Row>
          <Col sm={12}>
            <div>
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={20}
              totalItemsCount={this.state.posts.length}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
            />
          </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Thread;
