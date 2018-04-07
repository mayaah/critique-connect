import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';
import { Checkbox, TextArea, RadioGroup, Radio } from "@blueprintjs/core";

import { firebaseDB, base } from '../base'

class Forum extends Component {
	constructor() {
    super()
      this.state = {
      redirect: false,
      threads: []
    }

    this.threadsRef = firebaseDB.database().ref(`/Threads`)
    this.simplifyDate = this.simplifyDate.bind(this);
  }	

  componentWillMount() {
  	this.threadsRef.on('value', snapshot => {
      let threads = snapshot.val();
      let newState = [];
      let promises = [];
      for (let thread in threads) {
      	var threadRef = firebaseDB.database().ref(`/Threads/${thread}`)
      	promises.push(threadRef.once('value')); 
      }
      Promise.all(promises).then((snapshots) => {
        snapshots.forEach((snapshot) => {
          var thread = snapshot.val()
          let postsCount = 0
          threadRef.child("Posts").on("value", function(snapshot2) {
					  postsCount = snapshot2.numChildren()
					})
	        newState.push({
	          id: snapshot.key,
	          author: thread.author,
	          date: this.simplifyDate(new Date(thread.date).toUTCString()),
	          topic: thread.topic,
	          postsCount: postsCount
	        });
	      });
	      var sortedArr = newState.sort(function(a, b){
	        var keyA = new Date(a.date),
	            keyB = new Date(b.date);
	        // Compare the 2 dates
	        if(keyA < keyB) return 1;
	        if(keyA > keyB) return -1;
	        return 0;
	      });
	      this.setState({
          threads: sortedArr
        });
      })
    })
  }

  componentWillUmount() {
  	this.theadsRef.off();
  }

  simplifyDate(date) {
    let dateArray = date.split(" ")
    let dateOnly = dateArray.slice(1, 4)
    return dateOnly.join(" ")
  }

  render() {

	  return (
      <Grid style={{marginTop: "100px"}}>
      	<Row>
      		<Col sm={12} className="flex forum-header">
		      	<div className="page-name">Forum</div>
		      	<Button className="black-bordered-button">
		      		<Link className="flex" to={"/submit_thread"} >New Thread</Link>
		      	</Button>
		      </Col>
	      </Row>
	      <Row className="forum-grid">
	      	<Col sm={12}>
	      		{this.state.threads.map((thread) => {
              return (
              	<Row className="forum-thread-row">
              		<Col sm={8}>
              			<div className="thread-row-topic">{thread.topic}</div>
              		</Col>
              		<Col sm={2}>
              			<div className="thread-row-postCount">{thread.postsCount} comments</div>
              		</Col>
              		<Col sm={2}>
              			<div className="thread-row-date">{thread.date}</div>
              		</Col>
              	</Row>
              )
            })}
	      	</Col>
	      </Row>
      </Grid>
	  );

  }
}

export default Forum