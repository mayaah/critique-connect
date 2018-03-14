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
      reviewerId: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : "",
      revieweeId: this.props.revieweeId,
      reviewerName: "",
      revieweeName: this.props.revieweeName,
      reviewDate: "",
      reviewerAvatar: "",
      traits: ""
    }
    this.revieweeRef = firebaseDB.database().ref(`/Users/${this.state.revieweeId}`)
    this.reviewerRef = firebaseDB.database().ref(`/Users/${this.state.reviewerId}`)
    this.revieweeReviewsRef = firebaseDB.database().ref(`/Users/${this.state.revieweeId}/Reviews`)
    this.revieweeTraitsRef = firebaseDB.database().ref(`/Users/${this.state.revieweeId}/Traits`)
    this.handleChange = this.handleChange.bind(this);
    this.handleTraitsSelectChange = this.handleTraitsSelectChange.bind(this);
    this.submitReview = this.submitReview.bind(this);
  }

  componentWillMount() {
		this.revieweeRef.on('value', snapshot => {
			let reviewee = snapshot.val()
			this.setState({
				revieweeName: reviewee.displayName,
			})
		})
		this.reviewerRef.on('value', snapshot => {
			let reviewer = snapshot.val()
			this.setState({
				reviewerAvatar: reviewer.avatarURL,
				reviewerName: reviewer.displayName
			})
		})
  }

  componentWillUnmount() {
  	this.revieweeRef.off();
  	this.reviewerRef.off();
  	this.revieweeReviewsRef.off();
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

	simplifyDate(date) {
    let dateArray = date.split(" ")
    let dateOnly = dateArray.slice(1, 4)
    return dateOnly.join(" ")
  }

  submitReview(event) {
  	event.preventDefault()
  	const reviewsRef = firebaseDB.database().ref('Reviews');
  	const review = {
  		reviewMessage: this.state.reviewMessage,
      reviewerId: this.state.reviewerId,
      revieweeId: this.state.revieweeId,
      reviewerName: this.state.reviewerName,
      revieweeName: this.state.revieweeName,
      reviewDate: this.simplifyDate(new Date(Date.now()).toUTCString()),
      reviewerAvatar: this.state.reviewerAvatar,
      traits: this.state.traits.split(",")
  	}
  	var newReviewRef = reviewsRef.push(review);
  	var reviewId = newReviewRef.key;
  	this.addReviewToReviewee(reviewId)
  	this.updateRevieweeTraits()
  	this.submitReviewForm.reset()
  	this.setState({
  		reviewMessage: "",
  		traits: ""
  	})
  }

  addReviewToReviewee(reviewId) {
  	this.revieweeReviewsRef.update({
  		[reviewId]: true
  	})
  }

  updateRevieweeTraits() {
  	let traitsArray = this.state.traits.split(",")
  	for (let traitIndex in traitsArray) {
  		let trait = traitsArray[traitIndex]
  		let newTraitCount = 1
  		firebaseDB.database().ref(`/Users/${this.state.revieweeId}/Traits/${trait}`).once("value",snapshot => {
    		const traitData = snapshot.val();
    		if (traitData) {
    			newTraitCount = snapshot.val() + 1
    		}
    	})
  		this.revieweeTraitsRef.update({
  			[trait]: newTraitCount
  		})
  	}
  }

  render() {

    return (
      <form onSubmit={(event) => this.submitReview(event)} ref={(form) => this.submitReviewForm = form}>
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
    )
  }
}

export default NewReviewForm