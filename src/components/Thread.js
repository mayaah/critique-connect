import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import NewPostForm from './NewPostForm'
import { Grid, Row, Col, Image } from 'react-bootstrap';
import Pagination from "react-js-pagination";
import * as constants from '../constants';
import { firebaseDB } from '../base'

class Thread extends Component {
	constructor(props){
    super(props)
    this.state = {
      redirect: false,
      threadId: this.props.match.params.threadId,
      topic: "",
      posts: [],
      currentPosts: [],
      activePage: 1,
      doesNotExist: false
    }
    this.threadRef = firebaseDB.database().ref(`Threads/${this.state.threadId}`);
    this.postsRef = firebaseDB.database().ref(`Threads/${this.state.threadId}/Posts`)
    this.simplifyDate = this.simplifyDate.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.loadPosts = this.loadPosts.bind(this);
  }

  componentWillUnmount() {
    this.threadRef.off()
    this.postsRef.off()
  }

  componentDidMount() {
    this.threadRef.on('value', snapshot => {
      let thread = snapshot.val()
      if (thread) {
        this.setState({
          topic: thread.topic ? thread.topic : "",
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
            newState.push({
              id: snapshot.key,
              authorId: null,
              author: constants.DELETED_STRING,
              authorAvatar: constants.DEFAULT_AVATAR_URL,
              comment: post.comment,
              date: post.date
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
              postAuthorAvatar = postAuthor.avatarURL
              newState.push({
                id: snapshot.key,
                authorId: post.author,
                author: postAuthorName,
                authorAvatar: postAuthorAvatar,
                comment: post.comment,
                date: post.date
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

	render() {
    if (this.state.doesNotExist === true) {
      return <Redirect to= {{pathname: '/not_found'}} />
    }
    
    return (
	  	<Grid style={{marginTop: "100px"}}>
        <Row className="forum-header">
          <Col sm={12}>
            <div className="page-name">
              {this.state.topic}
            </div>
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
                </Col>
                <Col sm={10}>
                  <div className="post-comment">
                    {post.comment}
                  </div>
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
