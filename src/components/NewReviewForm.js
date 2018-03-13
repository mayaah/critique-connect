import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { Checkbox, TextArea } from "@blueprintjs/core";
import Select from 'react-select';
import TextareaAutosize from 'react-autosize-textarea';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';

import { firebaseDB, base } from '../base'


const TRAITS = [
	{ label: "Constructive", value: "Constructive" },
	{ label: "Detailed", value: "Detailed" },
	{ label: "Encouraging", value: "Encouraging" },
	{ label: "Honest", value: "Honest" },
	{ label: "Insightful", value: "Insightful" },
	{ label: "Kind", value: "Kind" },
	{ label: "Respectful", value: "Respectful" },
	{ label: "Thorough", value: "Thorough"},
	{ label: "Timely", value: "Timely" }
];

class NewReviewForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      reviewMessage: "",
      reviewer: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : "",
      revieweeId: this.props.revieweeId,
      revieweeName: this.props.revieweeName,
      reviewDate: "",
      reviewerAvatar: "",
      traits: ""
    }
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.userId}`)
    this.WIPsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/WIPs`)
    this.handleChange = this.handleChange.bind(this);
    this.handleTraitsSelectChange = this.handleTraitsSelectChange.bind(this);
    this.createWIP = this.createWIP.bind(this);
  }

  componentWillMount() {

  }

  componentWillUnmount() {
  	this.userRef.off();
  	this.WIPsRef.off();
  }

  handleChange(event) {
    this.setState({ 
    	[event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  }

  handleTraitsSelectChange(value) {
		this.setState({
			traits: value
		})
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
	  // this.WIPGenresRef = firebaseDB.database().ref(`/WIPs/${WIPId}/genres`)
	  // for (let genreKey in GENRES) {
   //  	let genre = GENRES[genreKey].value
   //  	let genresString = this.state.genres
   //  	if (genresString.length > 0 && genresString.split(',').includes(genre)) {
			// 	this.WIPGenresRef.update({
			// 		[genre] : true
			// 	})
			// }
			// else {
			// 	this.WIPGenresRef.update({
			// 		[genre] : false
			// 	})
   //  	}
   //  }
   //  this.WIPTypesRef = firebaseDB.database().ref(`/WIPs/${WIPId}/types`)
   //  for (let WIPTypeKey in TYPES) {
   //  	let WIPType = TYPES[WIPTypeKey].value
   //  	let typesString = this.state.types
   //  	if (typesString.length > 0 && typesString.split(',').includes(WIPType)) {
   //  		this.WIPTypesRef.update({
   //  			[WIPType] : true
   //  		})
   //  	}
   //  }
    this.addWIPToUser(WIPId)
    this.WIPForm.reset()
    this.setState({ redirect: true })
  }

  addWIPToUser(WIPId) {
    // this.userRef.on('value', snapshot => {
    //   this.setState({
    //     displayName: snapshot.val().displayName
    //   });
    // });
    this.WIPsRef.update({
      [WIPId]: true
    });
  }

  render() {

    return (
    	<div>
	    	<div className="section-divider">
	        <span className="section-divider-title">
	          Reviews
	        </span>
	        <div className="section-divider-hr"></div>
	      </div>
	      <form onSubmit={(event) => this.submitReview(event)} ref={(form) => this.SubmitReviewForm = form}>
	        <TextArea className="review-textarea" large={true} value={this.state.reviewMessage} name="reviewMessage" onChange={this.handleChange} label="reviewMessage" placeholder='Write a review for me'/>
	        <Select
	          className="multiselect-field"
	          closeOnSelect={false}
	          disabled={false}
	          multi
	          onChange={this.handleTraitsSelectChange}
	          options={TRAITS}
	          placeholder='I am ...'
	          simpleValue
	          value={this.state.traits}
	        />
	        <input type="submit" className="black-bordered-button" value="Submit Review"></input>
	      </form>
	    </div> 
    )
  }
}

export default NewReviewForm