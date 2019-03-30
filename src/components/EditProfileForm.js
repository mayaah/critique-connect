import React, { Component } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { Checkbox } from "@blueprintjs/core";
import Select from 'react-select';
import FileUploader from 'react-firebase-file-uploader';
import { Grid, Button } from 'react-bootstrap';
import TextareaAutosize from 'react-autosize-textarea';
import * as constants from '../constants';
import { firebaseDB } from '../base';

class EditProfileForm extends Component {
	constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      userId: this.props.currentUserId,
      currentUser: firebaseDB.auth().currentUser,
      displayName: "",
      lfr: false,
      ltr: false,
      bio: "",
      location: "",
      occupation: "",
      education: "",
      website: "",
      email: "",
      fbProfile: "",
      twitterProfile: "",
      genresWrite: "",
      genresRead: "",
      avatar: "",
	    avatarIsUploading: false,
	    avatarUploadProgress: 0,
	    avatarURL: "",
	    critiqueTolerance: "",
	    critiqueStyle: "",
	    goals: "",
	    compensation: "",
	    rates: "",
	    contact: "",
	    deleted: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleGenreWriteSelectChange = this.handleGenreWriteSelectChange.bind(this);
    this.handleGenreReadSelectChange = this.handleGenreReadSelectChange.bind(this);
    this.handleCompensationChange = this.handleCompensationChange.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.currentUser.uid}`);
    this.removeUsersWips = this.removeUsersWips.bind(this);
    this.removeUsersFromThreads = this.removeUsersFromThreads.bind(this);
    this.removeUsersFromPosts = this.removeUsersFromPosts.bind(this);
    this.removeUsersFromReviews = this.removeUsersFromReviews.bind(this);
    this.deleteUserIndexRecord = this.deleteUserIndexRecord.bind(this);
    this.addOrUpdateIndexRecord = this.addOrUpdateIndexRecord.bind(this);
    this.cleanUpUserFromOtherData = this.cleanUpUserFromOtherData.bind(this);
  }

  componentDidMount() {
  	window.scrollTo(0,0);
    this.userRef.on('value', snapshot => {
    	let currentUser = snapshot.val()
      this.setState({
        displayName: currentUser.displayName,
	      lfr: currentUser.lfr ? currentUser.lfr : false,
	      ltr: currentUser.ltr ? currentUser.ltr : false,
	      bio: currentUser.bio ? currentUser.bio : "",
	      location: currentUser.location ? currentUser.location : "",
	      education: currentUser.education ? currentUser.education: "",
	      occupation: currentUser.occupation ? currentUser.occupation : "",
	      website: currentUser.website ? currentUser.website : "",
	      fbProfile: currentUser.fbProfile ? currentUser.fbProfile : "",
	      twitterProfile: currentUser.twitterProfile ? currentUser.twitterProfile : "",
	      email: currentUser.email ? currentUser.email : "",
	      avatarURL: currentUser.avatarURL ? currentUser.avatarURL : "",
	      genresWrite: currentUser.genresWrite ? currentUser.genresWrite.join(",") : "",
	      genresRead: currentUser.genresRead ? currentUser.genresRead.join(",") : "",
	      critiqueTolerance: currentUser.critiqueTolerance ? currentUser.critiqueTolerance : "",
	      critiqueStyle: currentUser.critiqueStyle ? currentUser.critiqueStyle : "",
	      goals: currentUser.goals ? currentUser.goals : "",
	      compensation: currentUser.compensation ? currentUser.compensation : "",
	      rates: currentUser.rates ? currentUser.rates : "",
	      contact: currentUser.contact ? currentUser.contact : ""
      });
    });
  }

  componentWillUnmount() {
		this.userRef.off();
  }

  handleChange(event) {
    this.setState({ 
    	[event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  }

  handleGenreWriteSelectChange(value) {
		this.setState({
			genresWrite: value 
		});
	}

	handleGenreReadSelectChange(value) {
		this.setState({
			genresRead: value
		})
	}

	handleCompensationChange(value) {
		this.setState({
			compensation: value,
		});
	}

	handleUploadStart() {
		this.setState({
			avatarIsUploading: true,
			avatarUploadProgress: 0
		})
	}

	handleProgress(progress) {
		this.setState({
			avatarUploadProgress: progress
		})
	}

	handleUploadError(error) {
    this.setState({avatarIsUploading: false});
    console.error(error);
  }

  handleUploadSuccess(filename) {
    this.setState({
    	avatar: filename, 
    	avatarUploadProgress: 100, 
    	avatarIsUploading: false
    });
    firebaseDB.storage().ref('images').child(filename).getDownloadURL().then(url => 
    	this.setState({
    		avatarURL: url
    	})
  	);
  };

  updateUserProfile(event) {
    event.preventDefault()
	  this.userRef.update({
      displayName: this.state.displayName,
	    lfr: this.state.lfr,
	    ltr: this.state.ltr,
	    bio: this.state.bio,
	    location: this.state.location,
	    education: this.state.education,
	    occupation: this.state.occupation,
	    website: this.state.website,
	    fbProfile: this.state.fbProfile,
	    twitterProfile: this.state.twitterProfile,
	    email: this.state.email,
	    avatarURL: this.state.avatarURL,
	    genresWrite: this.state.genresWrite.split(","),
	    genresRead: this.state.genresRead.split(","),
	    critiqueStyle: this.state.critiqueStyle,
	    critiqueTolerance: this.state.critiqueTolerance,
	    goals: this.state.goals,
	    compensation: this.state.compensation,
	    rates: this.state.rates,
	    contact: this.state.contact
    });
    this.EditProfileForm.reset()
    this.addOrUpdateIndexRecord(this.state.userId)
    this.setState({ redirect: true })
  }

  removeUsersWips() {
  	const usersWIPsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/WIPs`)
  	usersWIPsRef.on('value', snapshot => {
  		let usersWIPs = snapshot.val();
	    for (let userWIP in usersWIPs) {
	      var WIPRef = firebaseDB.database().ref(`/WIPs/${userWIP}`)
	      WIPRef.remove();
				WIPRef.on('value', snapshot => {
					// Get Algolia's objectID from the Firebase object key
					const objectID = snapshot.key;
					// Remove the object from Algolia
					constants.wipsIndex
					.deleteObject(objectID)
					.then(() => {
						console.log('Firebase object deleted from Algolia', objectID);
					})
					.catch(error => {
						console.error('Error when deleting contact from Algolia', error);
					});
				})
	    }
    });
  }

  // Re-assign threads to deleted user
  removeUsersFromThreads() {
  	const usersThreadsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/Threads`)
  	usersThreadsRef.on('value', snapshot => {
  		let usersThreads = snapshot.val();
  		for (let usersThread in usersThreads) {
	      var threadRef = firebaseDB.database().ref(`/Threads/${usersThread}`)
	      threadRef.update({
	      	author: "[deleted]"
	      })
	    }
  	})
  }

	// Re-assign posts to deleted user
  removeUsersFromPosts() {
  	const usersPostsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/Posts`)
  	usersPostsRef.on('value', snapshot => {
  		let usersPosts = snapshot.val();
  		for (let usersPost in usersPosts) {
	      var postRef = firebaseDB.database().ref(`/Posts/${usersPost}`)
	      postRef.update({
	      	author: "[deleted]"
	      })
	    }
  	})
  }

  removeUsersFromReviews() {
  	const usersReviewsGivenRef = firebaseDB.database().ref(`/Users/${this.state.userId}/ReviewsGiven`)
  	usersReviewsGivenRef.on('value', snapshot => {
  		let reviewsGiven = snapshot.val();
  		for (let review in reviewsGiven) {
	      var reviewRef = firebaseDB.database().ref(`/Reviews/${review}`)
	      reviewRef.update({
	      	reviewerId: "[deleted]"
	      })
	    }
  	})
  }

  deleteAccount() {
    this.cleanUpUserFromOtherData().then(() => {
    	this.userRef.off();
    	var userRef = firebaseDB.database().ref(`/Users/${this.state.userId}`)
    	this.setState({ deleted: true },
    		() => {
    			userRef.remove();
    			firebaseDB.auth().currentUser.delete();
  			}
			)
		})
  }

  cleanUpUserFromOtherData() {
  	return Promise.all([
  		this.removeUsersWips(), 
  		this.removeUsersFromThreads(),
  		this.removeUsersFromPosts(),
  		this.removeUsersFromReviews(),
  		this.deleteUserIndexRecord(this.state.userId),
		])
  }

  deleteUserIndexRecord(userId) {
  	const userRef = firebaseDB.database().ref(`Users/${userId}`);
  	userRef.on('value', snapshot => {
	  	// Get Algolia's objectID from the Firebase object key
		  const objectID = snapshot.key;
		  // Remove the object from Algolia
		  constants.usersIndex
		    .deleteObject(objectID)
		    .then(() => {
		      console.log('Firebase object deleted from Algolia', objectID);
		    })
		    .catch(error => {
		      console.error('Error when deleting contact from Algolia', error);
		    });
	  })
	}

	addOrUpdateIndexRecord(userId) {
		const userRef = firebaseDB.database().ref(`Users/${userId}`);
		userRef.on('value', snapshot => {
		  // Get Firebase object
		  const record = snapshot.val();
		  // Specify Algolia's objectID using the Firebase object key
		  // Add or update object
		  const recordToSend = {
		  	objectID: snapshot.key,
		  	avatarURL: record.avatarURL,
		  	ltr: record.ltr,
		  	lfr: record.lfr,
		  	displayName: record.displayName,
		  	lastLogin: record.lastLogin,
		  	compensation: record.compensation,
		  	genresWrite: record.genresWrite,
		  	genresRead: record.genresRead
		  }
		  constants.usersIndex
		    .saveObject(recordToSend)
		    .then(() => {
		      console.log('Firebase object indexed in Algolia', record.objectID);
		    })
		    .catch(error => {
		      console.error('Error when indexing contact into Algolia', error);
  		    });
	  })
	}

  render() {
  	if (this.state.redirect === true) {
      return <Redirect to= {{pathname: '/user/' + this.state.currentUser.uid}} />
    }
    if (this.state.deleted === true) {
      return <Redirect to= {{pathname: '/logout'}} />
    }
    return (
    	<div>
	    	<BrowserRouter>
		      <Grid style={{marginTop: "100px"}}>
		      	<div className="form-name">
		      		Edit Profile
	      		</div>
		        <form className="center-form" 
		        			onSubmit={(event) => this.updateUserProfile(event)} 
		        			ref={(form) => this.EditProfileForm = form}
      			>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">
		            	Name
	            	</span>
		            <input 
		            	className="pt-input input-field" 
		            	value={this.state.displayName} 
		            	name="displayName" 
		            	onChange={this.handleChange} 
		            	type="text" 
		            	placeholder={this.state.displayName}
	            	>
          			</input>
		          </label>
		          <label className="pt-label form-field-box">
								<span className="label-field-name">
									Avatar
								</span>
								{this.state.isUploading && (
			            <p>Progress: {this.state.progress}</p>
			          )}
			          {this.state.avatarURL && (
			            <img className="field-avatar" src={this.state.avatarURL} alt="user avatar"/>
			          )}
			          <FileUploader
			          	className="avatar-upload-button"
			            accept="image/*"
			            name="avatar"
			            randomizeFilename
			            storageRef={firebaseDB.storage().ref('images')}
			            onUploadStart={this.handleUploadStart}
			            onUploadError={this.handleUploadError}
			            onUploadSuccess={this.handleUploadSuccess}
			            onProgress={this.handleProgress}
			          />
							</label>
	            <Checkbox 
	            	className="input-checkbox form-field-box" 
	            	checked={this.state.lfr} 
	            	value={this.state.lfr} 
	            	name="lfr" 
	            	onChange={this.handleChange} 
	            	label="Is Looking For Reader"
    					/>
	            <Checkbox 
	            	className="input-checkbox form-field-box"
	            	checked={this.state.ltr} 
	            	value={this.state.ltr} 
	            	name="ltr" 
	            	onChange={this.handleChange} 
	            	label="Is Looking To Read"
    					/>
	            <label className="pt-label form-field-box"> 
	            	<span className="label-field-name">
	            		Bio
            		</span>
		            <TextareaAutosize 
		            	className="textarea-field" 
		            	large="true"
		            	value={this.state.bio} 
		            	name="bio" 
		            	onChange={this.handleChange} 
		            	label="Bio" 
		            	onResize={(e) => {}}
								/>
							</label>
							<label className="pt-label form-field-box">
		            <span className="label-field-name">
		            	Location
	            	</span>
		            <input 
		            	className="pt-input input-field" 
		            	value={this.state.location} 
		            	name="location"
		            	onChange={this.handleChange}
		            	type="text"
	            	>
        			  </input>
		          </label>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">
		            	Occupation
	            	</span>
		            <input 
		            	className="pt-input input-field" 
	            		value={this.state.occupation}
	            		name="occupation"
	            		onChange={this.handleChange}
	            		type="text"
            		>
        				</input>
		          </label>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">
		            	Education
	            	</span>
		            <input 
		            	className="pt-input input-field" 
		            	value={this.state.education}
		            	name="education"
		            	onChange={this.handleChange}
		            	type="text"
	            	>
          			</input>
		          </label>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">
		            	Website
	            	</span>
		            <input 
		            	className="pt-input input-field"
            			value={this.state.website}
		            	name="website"
		            	onChange={this.handleChange}
		            	type="url"
	            	>
          			</input>
		          </label>
		           <label className="pt-label form-field-box">
		            <span className="label-field-name">
		            	Email
	            	</span>
		            <input 
		            	className="pt-input input-field"
		            	value={this.state.email}
		            	name="email"
		            	onChange={this.handleChange}
		            	type="email"
	            	>
        			  </input>
		          </label>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">
		            	Facebook Profile Link
	            	</span>
		            <input 
		            	className="pt-input input-field"
		            	value={this.state.fbProfile}
		            	name="fbProfile"
		            	onChange={this.handleChange}
		            	type="url"
	            	>
        			  </input>
		          </label>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">
		            	Twitter Profile Link
	            	</span>
		            <input 
		            	className="pt-input input-field"
		            	value={this.state.twitterProfile}
		            	name="twitterProfile"
		            	onChange={this.handleChange}
		            	type="url">
          			</input>
		          </label>
		          <label className="pt-label form-field-box"> 
	            	<span className="label-field-name">
	            		Best Way to Contact Me
            		</span>
		            <TextareaAutosize 
		            	className="textarea-field"
		            	large="true"
		            	value={this.state.contact}
		            	name="contact"
		            	onChange={this.handleChange}
		            	label="contact"
								/>
							</label>
		          <label className="pt-label form-field-box">
		          	<span className="label-field-name">
		          		Genres I Write
	          		</span>
			          <Select
			          	className="multiselect-field"
									closeOnSelect={false}
									disabled={false}
									multi
									onChange={this.handleGenreWriteSelectChange}
									options={constants.GENRES}
									placeholder="Select your favorite(s)"
									simpleValue
									value={this.state.genresWrite}
								/>
							</label>
							<label className="pt-label form-field-box">
		          	<span className="label-field-name">Genres I Read</span>
			          <Select
			          	className="multiselect-field"
									closeOnSelect={false}
									disabled={false}
									multi
									onChange={this.handleGenreReadSelectChange}
									options={constants.GENRES}
									placeholder="Select your favorite(s)"
									simpleValue
									value={this.state.genresRead}
								/>
							</label>
							<label className="pt-label form-field-box"> 
	            	<span className="label-field-name">
	            		Goals
            		</span>
		            <TextareaAutosize 
		            	className="textarea-field"
		            	large="true"
		            	value={this.state.goals}
		            	name="goals"
		            	onChange={this.handleChange}
		            	label="Goals"
								/>
							</label>
							{this.state.lfr ? (
								<div >
									<label className="pt-label form-field-box"> 
			            	<span className="label-field-name">
			            		Critique Tolerance
		            		</span>
				            <TextareaAutosize 
				            	className="textarea-field"
				            	large="true"
				            	value={this.state.critiqueTolerance}
				            	name="critiqueTolerance"
				            	onChange={this.handleChange}
				            	label="critiqueTolerance"
  									/>
									</label>
								</div>
							) : (
								null
							)}
							{this.state.ltr ? (
								<div>
									<label className="pt-label form-field-box"> 
			            	<span className="label-field-name">
			            		Critique Style
		            		</span>
				            <TextareaAutosize 
				            	className="textarea-field"
				            	large="true"
				            	value={this.state.critiqueStyle}
				            	name="critiqueStyle"
				            	onChange={this.handleChange}
				            	label="critiqueStyle"
  									/>
									</label>
									<label className="pt-label form-field-box">
				          	<span className="label-field-name">
				          		Critique Compensation Type
			          		</span>
					          <Select
					          	className="select-field"
											closeOnSelect={false}
											disabled={false}
											onChange={this.handleCompensationChange}
											options={constants.COMPENSATION_TYPES}
											placeholder="Select compensation type"
											simpleValue
											value={this.state.compensation}
										/>
									</label>
								</div>
							) : (
								null
							)}
							{this.state.compensation === "Paid Services" ?  (
								<label className="pt-label form-field-box"> 
		            	<span className="label-field-name">
		            		Paid Services Rates
	            		</span>
			            <TextareaAutosize 
			            	className="textarea-field"
			            	large="true"
			            	value={this.state.rates}
			            	name="rates"
			            	onChange={this.handleChange}
			            	label="rates"
									/>
								</label>
							) : (
								null
							)}
		          <input 
		          	type="submit" 
		          	className="black-bordered-button" 
		          	value="Save"
	          	>
	          	</input>
		        </form>
		        <Button 
		        	className="black-bordered-button red" 
              onClick={() => { if (window.confirm('Are you sure you wish to delete your account?')) this.deleteAccount() }}
            >
              Delete Account
            </Button>
		      </Grid>
	      </BrowserRouter>
      </div>
    )
  }
}

export default EditProfileForm;
