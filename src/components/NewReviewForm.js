import React, { Component } from 'react';
import { TextArea } from "@blueprintjs/core";
import Select from 'react-select';
import * as constants from '../constants';
import { firebaseDB } from '../base'

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
    this.reviewerReviewsGivenRef = firebaseDB.database().ref(`/Users/${this.state.reviewerId}/ReviewsGiven`)
    this.revieweeTraitsRef = firebaseDB.database().ref(`/Users/${this.state.revieweeId}/Traits`)
    this.handleChange = this.handleChange.bind(this);
    this.handleTraitsSelectChange = this.handleTraitsSelectChange.bind(this);
    this.submitReview = this.submitReview.bind(this);
  }

  componentWillMount() {
		this.revieweeRef.on('value', snapshot => {
			let reviewee = snapshot.val()
      if (reviewee) {
  			this.setState({
  				revieweeName: reviewee.displayName,
  			})
      }
		})
		this.reviewerRef.on('value', snapshot => {
			let reviewer = snapshot.val()
      if (reviewer) {
  			this.setState({
  				reviewerAvatar: reviewer.avatarURL,
  				reviewerName: reviewer.displayName
  			})
      }
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
    if (this.state.reviewMessage.length === 0 && this.state.traits.length === 0) {
      alert("Cannot submit empty review.")
      return false
    }
  	const reviewsRef = firebaseDB.database().ref('Reviews');
  	const review = {
  		reviewMessage: this.state.reviewMessage,
      reviewerId: this.state.reviewerId,
      revieweeId: this.state.revieweeId,
      revieweeName: this.state.revieweeName,
      reviewDate: Date.now(),
      traits: this.state.traits ? this.state.traits.split(",") : []
  	}
  	var newReviewRef = reviewsRef.push(review);
  	var reviewId = newReviewRef.key;
  	this.addReviewToReviewee(reviewId)
    this.addReviewToReviewer(reviewId)
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

  addReviewToReviewer(reviewId) {
    this.reviewerReviewsGivenRef.update({
      [reviewId]: true
    })
  }

  updateRevieweeTraits() {
  	let selectedTraitsArray = this.state.traits.split(",")
  	for (let traitIndex in constants.TRAITS_LIST) {
  		let trait = constants.TRAITS_LIST[traitIndex]
  		let newTraitCount = 0
  		firebaseDB.database().ref(`/Users/${this.state.revieweeId}/Traits/${trait}`).once("value",snapshot => {
    		const traitData = snapshot.val();
    		if (traitData && (selectedTraitsArray.includes(trait))) {
    			newTraitCount = snapshot.val() + 1
    		}
    		else if (traitData && !selectedTraitsArray.includes(trait)) {
    			newTraitCount = snapshot.val()
    		}
    		else if (!traitData && (selectedTraitsArray.includes(trait))) {
    			newTraitCount = 1
    		}
  		})
  		this.revieweeTraitsRef.update({
  			[trait]: newTraitCount
  		})
  	}
  }

  render() {

    return (
      <form 
        onSubmit={(event) => this.submitReview(event)} 
        ref={(form) => this.submitReviewForm = form}
      >
        <TextArea 
          className="review-textarea" 
          large={true} 
          value={this.state.reviewMessage} 
          name="reviewMessage" 
          onChange={this.handleChange} 
          label="reviewMessage" 
          placeholder={'Write a review for ' + this.state.revieweeName}
        />
        <Select
          className="multiselect-field"
          closeOnSelect={false}
          disabled={false}
          multi
          onChange={this.handleTraitsSelectChange}
          options={constants.TRAITS}
          placeholder={this.state.revieweeName + ' is ...'}
          simpleValue
          value={this.state.traits}
        />
        <button 
          type="submit" 
          className="black-bordered-button" 
        >
          Submit Review
        </button>
      </form>
    )
  }
}

export default NewReviewForm;
