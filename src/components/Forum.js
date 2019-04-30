import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Row, Col, Button, Image } from 'react-bootstrap';
import Pagination from "react-js-pagination";
import { firebaseDB } from '../base'

class Forum extends Component {
	constructor() {
    super()
      this.state = {
      redirect: false,
      threads: [],
      currentThreads: [],
      activePage: 1
    }

    this.threadsRef = firebaseDB.database().ref(`/Threads`)
    this.simplifyDate = this.simplifyDate.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }	

  componentWillMount() {
  	this.threadsRef.on('value', snapshot => {
      let threads = snapshot.val();
      let newState = [];
      let pinnedThreads = [];
      let promises = [];
      for (let thread in threads) {
      	var threadRef = firebaseDB.database().ref(`/Threads/${thread}`)
      	promises.push(threadRef.once('value')); 
      }
      Promise.all(promises).then((snapshots) => {
        snapshots.forEach((snapshot) => {
          var thread = snapshot.val()
          let postsCount = 0
          var threadRef = firebaseDB.database().ref(`/Threads/${snapshot.key}`)
          threadRef.child("Posts").on("value", function(snapshot2) {
					  postsCount = snapshot2.numChildren()
					})
          if (thread.pinned) {
            pinnedThreads.push({
              id: snapshot.key,
              author: thread.author,
              dateUnix: thread.date,
              date: this.simplifyDate(new Date(thread.date).toUTCString()),
              topic: thread.topic,
              pinned: thread.pinned,
              postsCount: postsCount
            })
          } else {
            newState.push({
              id: snapshot.key,
              author: thread.author,
              dateUnix: thread.date,
              date: this.simplifyDate(new Date(thread.date).toUTCString()),
              topic: thread.topic,
              pinned: thread.pinned,
              postsCount: postsCount
            });
          }
	      });
	      var sortedArr = newState.sort(function(a, b){
	        var keyA = new Date(a.dateUnix),
	            keyB = new Date(b.dateUnix);
	        // Compare the 2 dates
	        if(keyA < keyB) return 1;
	        if(keyA > keyB) return -1;
	        return 0;
	      });
        var allThreads = pinnedThreads.concat(sortedArr)
	      this.setState({
          threads: allThreads,
          currentThreads: allThreads.slice(0, 20)
        });
      })
    })
  }

  componentDidUpdate(nextProps) {
    window.scrollTo(0,0);
  }

  componentWillUmount() {
  	this.theadsRef.off();
  }

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState(
    	{
    		activePage: pageNumber,
    		currentThreads: this.state.threads.slice((pageNumber - 1) * 20, (pageNumber - 1) * 20 + 20)
    	});
  }

  simplifyDate(date) {
    let dateArray = date.split(" ")
    let dateOnly = dateArray.slice(1, 4)
    return dateOnly.join(" ")
  }

  render() {

	  return (
      <Grid style={{marginTop: "100px", marginBottom: "50px"}}>
      	<Row>
      		<Col sm={12} className="flex forum-header">
		      	<div className="page-name">
              Forum
            </div>
            <Link className="flex" to={"/submit_thread"}>
  		      	<Button className="black-bordered-button">
                New Thread
  		      	</Button>
            </Link>
		      </Col>
	      </Row>
	      <Row className="forum-grid">
	      	<Col sm={12}>
	      		{this.state.currentThreads.map((thread) => {
              return (
              	<Link to={"/thread/" + thread.id} key={thread.id}>
	              	<Row className="forum-thread-row">
	              		<Col sm={8}>
	              			<div className="thread-row-topic">
                        {thread.pinned && (
                          <Image 
                            className="social-icons" 
                            src={require('../images/pin-red.png')} 
                          />
                        )}
                        {thread.topic}
                      </div>
	              		</Col>
	              		<Col sm={2}>
	              			<div className="thread-row-postCount">
                        {thread.postsCount} comments
                      </div>
	              		</Col>
	              		<Col sm={2}>
	              			<div className="thread-row-date">
                        {thread.date}
                      </div>
	              		</Col>
	              	</Row>
              	</Link>
              )
            })}
	      	</Col>
	      </Row>
	      <Row>
	      	<Col sm={12}>
	      		<div className="forum-paginate">
  		        <Pagination
  		          activePage={this.state.activePage}
  		          itemsCountPerPage={20}
  		          totalItemsCount={this.state.threads.length}
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

export default Forum;
