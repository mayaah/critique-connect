import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import NewPostForm from './NewPostForm'
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';

import { firebaseDB, base } from '../base'


class Thread extends Component {
	constructor(props){
    super(props)
    this.state = {
      redirect: false,
      threadId: this.props.match.params.threadId,
      topic: "",
      posts: []
    }
    this.threadRef = firebaseDB.database().ref(`Threads/${this.state.threadId}`);
    this.postsRef = firebaseDB.database().ref(`Threads/${this.state.threadId}/Posts`)
    this.simplifyDate = this.simplifyDate.bind(this);
  }

  componentDidMount() {
    this.threadRef.on('value', snapshot => {
      let thread = snapshot.val()
      this.setState({
        topic: thread.topic ? thread.topic : "",
      });
    })
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
          let postAuthorId = ""
          var postAuthorRef = firebaseDB.database().ref(`/Users/${post.author}`)
          postAuthorRef.once('value', snapshot2 => {
            let postAuthor = snapshot2.val();
            postAuthorName = postAuthor.displayName,
            postAuthorAvatar = postAuthor.avatarURL
            newState.push({
              id: snapshot.key,
              authorId: post.author,
              author: postAuthorName,
              authorAvatar: postAuthorAvatar,
              comment: post.comment,
              date: post.date
            });
            var sortedArr = newState.sort(function(a, b){
              var keyA = new Date(a.date),
                  keyB = new Date(b.date);
              // Compare the 2 dates
              if(keyA < keyB) return -1;
              if(keyA > keyB) return 1;
              return 0;
            });
            console.log(sortedArr)
            this.setState({
              posts: sortedArr
            });
          })
        });
      });
    });
  }

  componentWillUnmount() {
    this.threadRef.off()
    this.postsRef.off()
  }

  simplifyDate(date) {
    let dateArray = date.split(" ")
    let dateOnly = dateArray.slice(1, 4)
    return dateOnly.join(" ")
  }


	render() {
    
    return (
	  	<Grid style={{marginTop: "100px"}}>
        <Row className="forum-header">
          <Col sm={12}>
            <div className="page-name">{this.state.topic}</div>
          </Col>
        </Row>
        {this.state.posts.map((post) => {
          return (
            <Row className="post flex" key={post.id}>
              <Col sm={2}>
                <Link to={"/user/" + post.authorId}>
                  <div className="post-author-name">{post.author}</div>
                  <Image className="post-author-avatar" src={post.authorAvatar} responsive />
                </Link>
                <div className="post-date">{this.simplifyDate(new Date(post.date).toUTCString())}</div>
              </Col>
              <Col sm={10}>
                <div className="post-comment">{post.comment}</div>
              </Col>
            </Row>
          )
        })}
        <Row>
          <Col sm={12}>
            <NewPostForm threadId={this.state.threadId} /> 
          </Col>
        </Row> 
      </Grid>
	   );
  }
}

export default Thread