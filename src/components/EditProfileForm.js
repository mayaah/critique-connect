import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { Checkbox, TextArea } from "@blueprintjs/core";
import Select from 'react-select';
import FileUploader from 'react-firebase-file-uploader';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';



import { firebaseDB, base } from '../base'

const GENRES = [
	{ label: "Adventure", value: "adventure" },
	{ label: "Chick Lit", value: "cl"},
	{ label: "Contemporary, Mainstream, & Realistic", value: "cmrf" },
	{ label: "Children's", value: "children" },
	{ label: "Erotic", value: "erotic" },
	{ label: "Fantasy", value: "fantasy" },
	{ label: "Historical", value: "historical" },
	{ label: "Horror & Supernatural", value: "hs" },
	{ label: "LGBT+", value: "lgbt" },
	{ label: "Literary", value: "literary" },
	{ label: "Memoir & Autobiography", value: "ma" },
	{ label: "Middle Grade", value: "mg" },
	{ label: "Mystery, Thriller, & Suspense", value: "mts" },
	{ label: "New Adult", value: "na" },
	{ label: "Other Nonfiction", value: "nonfiction"},
	{ label: "Religious, Spiritual, & New Age", value: "rsna" },
	{ label: "Romance", value: "romance" },
	{ label: "Satire, Humor, & Parody", value: "shp" },
	{ label: "Science Fiction", value: "sf" },
	{ label: "Women's", value: "wf" },
	{ label: "Young Adult", value: "ya" }
];

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
	    avatarURL: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleGenreWriteSelectChange = this.handleGenreWriteSelectChange.bind(this);
    this.handleGenreReadSelectChange = this.handleGenreReadSelectChange.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.currentUser.uid}`);
    // this.genresWriteRef = firebaseDB.database().ref(`/Users/${this.state.currentUser.uid}/genresWrite`);
    // this.genresReadRef = firebaseDB.database().ref(`/Users/${this.state.currentUser.uid}/genresRead`);
  }

  handleChange(event) {
  	console.log(event.target.name)
    console.log(event.target.value)
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

  componentDidMount() {
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
	      genresRead: currentUser.genresRead ? currentUser.genresRead.join(",") : ""
      });
    });
   //  this.genresWriteRef.on('value', snapshot => {
			// let genresWriteHash = snapshot.val()
			// let selectedGenresWrite = []
			// for (let genre in genresWriteHash) {
			// 	if (genresWriteHash[genre]) {
   //  			selectedGenresWrite.push(genre)
   //  		}
   //  	}
   //  	this.setState({
   //  		genresWrite: selectedGenresWrite.join(',')
   //  	})
   //  })
   //  this.genresReadRef.on('value', snapshot => {
   //  	console.log(snapshot.val())
   //  	let genresReadHash = snapshot.val()
   //  	let selectedGenresRead = []
   //  	for (let genre in genresReadHash) {
   //  		if (genresReadHash[genre]) {
   //  			selectedGenresRead.push(genre)
   //  		}
   //  	}
   //  	this.setState({
   //  		genresRead: selectedGenresRead.join(',')
   //  	})
   //  })
  }

  componentWillUnmount() {
		this.userRef.off();
		// this.genresWriteRef.off();
		// this.genresReadRef.off();
  }

  updateUserProfile(event) {
    event.preventDefault()
   //  for (let genreKey in GENRES) {
   //  	let genre = GENRES[genreKey].value
   //  	let genresWriteString = this.state.genresWrite
   //  	if (genresWriteString.length > 0 && genresWriteString.split(',').includes(genre)) {
			// 	this.genresWriteRef.update({
			// 		[genre] : true
			// 	})
			// }
			// else {
			// 	this.genresWriteRef.update({
			// 		[genre] : false
			// 	})
   //  	}
   //  	let genresReadString = this.state.genresRead
   //  	if (genresReadString.length > 0 && genresReadString.split(',').includes(genre)) {
			// 	this.genresReadRef.update({
			// 		[genre] : true
			// 	})
			// }
			// else {
			// 	this.genresReadRef.update({
			// 		[genre] : false
			// 	})
			// }	
   //  }
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
	    genresRead: this.state.genresRead.split(",")
    });
    this.EditProfileForm.reset()
    this.setState({ redirect: true })
  }

  render() {
  	if (this.state.redirect === true) {
      return <Redirect to= {{pathname: '/user/' + this.state.currentUser.uid}} />
    }
    return (
    	<div>
	    	<BrowserRouter>
		      <Grid style={{marginTop: "100px"}}>
		      	<div className="form-name">Edit Profile</div>
		        <form className="center-form" onSubmit={(event) => this.updateUserProfile(event)} ref={(form) => this.EditProfileForm = form}>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">Name</span>
		            <input className="pt-input input-field" value={this.state.displayName} name="displayName" onChange={this.handleChange} type="text" placeholder={this.state.displayName} ></input>
		          </label>
		          <label className="pt-label form-field-box">
								<span className="label-field-name">Avatar</span>
								{this.state.isUploading &&
			            <p>Progress: {this.state.progress}</p>
			          }
			          {this.state.avatarURL &&
			            <img className="field-avatar" src={this.state.avatarURL} />
			          }
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
	            <Checkbox className="input-checkbox form-field-box" checked={this.state.lfr} value={this.state.lfr} name="lfr" onChange={this.handleChange} label="Is Looking For Reader" />
	            <Checkbox className="input-checkbox form-field-box" checked={this.state.ltr} value={this.state.ltr} name="ltr" onChange={this.handleChange} label="Is Looking To Read" />
	            <label className="pt-label form-field-box"> 
	            	<span className="label-field-name">Bio</span>
		            <TextareaAutosize className="textarea-field" large={true} value={this.state.bio} name="bio" onChange={this.handleChange} label="Bio" onResize={(e) => {}} />
							</label>
							<label className="pt-label form-field-box">
		            <span className="label-field-name">Location</span>
		            <input className="pt-input input-field" value={this.state.location} name="location" onChange={this.handleChange} type="text" ></input>
		          </label>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">Occupation</span>
		            <input className="pt-input input-field" value={this.state.occupation} name="occupation" onChange={this.handleChange} type="text" ></input>
		          </label>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">Education</span>
		            <input className="pt-input input-field" value={this.state.education} name="education" onChange={this.handleChange} type="text" ></input>
		          </label>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">Website</span>
		            <input className="pt-input input-field" value={this.state.website} name="website" onChange={this.handleChange} type="url" ></input>
		          </label>
		           <label className="pt-label form-field-box">
		            <span className="label-field-name">Email</span>
		            <input className="pt-input input-field" value={this.state.email} name="email" onChange={this.handleChange} type="email" ></input>
		          </label>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">Facebook Profile Link</span>
		            <input className="pt-input input-field" value={this.state.fbProfile} name="fbProfile" onChange={this.handleChange} type="url" ></input>
		          </label>
		          <label className="pt-label form-field-box">
		            <span className="label-field-name">Twitter Profile Link</span>
		            <input className="pt-input input-field" value={this.state.twitterProfile} name="twitterProfile" onChange={this.handleChange} type="url" ></input>
		          </label>
		          <label className="pt-label form-field-box">
		          	<span className="label-field-name">Genres I Write</span>
			          <Select
			          	className="multiselect-field"
									closeOnSelect={false}
									disabled={false}
									multi
									onChange={this.handleGenreWriteSelectChange}
									options={GENRES}
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
									options={GENRES}
									placeholder="Select your favorite(s)"
									simpleValue
									value={this.state.genresRead}
								/>
							</label>
							
		          <input type="submit" className="black-bordered-button" value="Save"></input>
		        </form>
		      </Grid>
	      </BrowserRouter>
      </div>
    )
  }
}

export default EditProfileForm