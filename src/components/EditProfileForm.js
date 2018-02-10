import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { Checkbox, TextArea } from "@blueprintjs/core";
import Select from 'react-select';

import { firebaseDB, base } from '../base'

const GENRES = [
	{ label: "Adventure", value: "adventure" },
	{ label: "Contemporary, Mainstream, & Realistic Fiction", value: "cmrf" },
	{ label: "Children's", value: "children" },
	{ label: "Erotic Fiction", value: "erotic" },
	{ label: "Fantasy", value: "fantasy" },
	{ label: "Historical Fiction", value: "historical" },
	{ label: "Horror & Supernatural", value: "hs" },
	{ label: "LGBT+", value: "lgbt" },
	{ label: "Literary", value: "literary" },
	{ label: "Memoir & Autobiography", value: "ma" },
	{ label: "Middle Grade", value: "mg" },
	{ label: "Mystery, Thriller, & Suspense", value: "mts" },
	{ label: "New Adult", value: "na" },
	{ label: "Plays", value: "plays" },
	{ label: "Religious, Spiritual, & New Age", value: "rsna" },
	{ label: "Romance", value: "romance" },
	{ label: "Satire, Humor, & Parody", value: "shp" },
	{ label: "Science Fiction", value: "sf" },
	{ label: "Screenwriting", value: "screenwriting" },
	{ label: "Women's Fiction", value: "wf" },
	{ label: "Young Adult", value: "ya" },
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
      website: "",
      genres: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.currentUser.uid}`)
  }

  handleChange(event) {
  	console.log(event.target.name)
    console.log(event.target.value)
    this.setState({ 
    	[event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  }

  componentDidMount() {
    this.userRef.on('value', snapshot => {
    	let currentUser = snapshot.val()
      this.setState({
        displayName: currentUser.displayName,
	      lfr: currentUser.lfr,
	      ltr: currentUser.ltr,
	      bio: currentUser.bio ? currentUser.bio : "",
	      location: currentUser.location ? currentUser.location : "",
	      occupation: currentUser.occupation ? currentUser.occupation : "",
	      website: currentUser.website ? currentUser.website : ""
      });
    });
  }

  handleSelectChange (value) {
		// console.log('You\'ve selected:', value);
		// var selectedGenres = this.state.genres.concat(value);
		this.setState({
			genres: value }
		);
		// this.setState({ genres });
	}

  componentWillUnmount() {
		this.userRef.off();
  }

  updateUserProfile(event) {
    event.preventDefault()
	  this.userRef.update({
      displayName: this.state.displayName,
	    lfr: this.state.lfr,
	    ltr: this.state.ltr,
	    bio: this.state.bio,
	    location: this.state.location,
	    occupation: this.state.occupation,
	    website: this.state.website,
	    genres: this.state.genres.split(',')
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
		      <div style={{marginTop: "100px"}}>
		        <form onSubmit={(event) => this.updateUserProfile(event)} ref={(form) => this.EditProfileForm = form}>
		          <label className="pt-label">
		            Name
		            <input className="pt-input" value={this.state.displayName} name="displayName" onChange={this.handleChange} type="text" placeholder={this.state.displayName} ></input>
		          </label>
	            <Checkbox checked={this.state.lfr} value={this.state.lfr} name="lfr" onChange={this.handleChange} label="Is Looking For Reader" />
	            <Checkbox checked={this.state.ltr} value={this.state.ltr} name="ltr" onChange={this.handleChange} label="Is Looking To Read" />
	            <label className="pt-label"> 
	            	Bio 
		            <TextArea large={true} value={this.state.bio} name="bio" onChange={this.handleChange} label="Bio" />
							</label>
							<label className="pt-label">
		            Location
		            <input className="pt-input" value={this.state.location} name="location" onChange={this.handleChange} type="text" ></input>
		          </label>
		          <label className="pt-label">
		            Occupation
		            <input className="pt-input" value={this.state.occupation} name="occupation" onChange={this.handleChange} type="text" ></input>
		          </label>
		          <label className="pt-label">
		            Website
		            <input className="pt-input" value={this.state.website} name="website" onChange={this.handleChange} type="url" ></input>
		          </label>
		          <label className="pt-label">
		          	Genres I Write
			          <Select
									closeOnSelect={false}
									disabled={false}
									multi
									onChange={this.handleSelectChange}
									options={GENRES}
									placeholder="Select your favorite(s)"
				          removeSelected={true}
									simpleValue
									value={this.state.genres}
								/>
							</label>
		          <input type="submit" className="pt-button pt-intent-primary" value="Save"></input>
		        </form>
		      </div>
	      </BrowserRouter>
      </div>
    )
  }
}

export default EditProfileForm