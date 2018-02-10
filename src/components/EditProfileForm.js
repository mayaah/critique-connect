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
	{ label: "Essays", value: "essays"},
	{ label: "Fantasy", value: "fantasy" },
	{ label: "Historical Fiction", value: "historical" },
	{ label: "Horror & Supernatural", value: "hs" },
	{ label: "LGBT+", value: "lgbt" },
	{ label: "Literary", value: "literary" },
	{ label: "Memoir & Autobiography", value: "ma" },
	{ label: "Middle Grade", value: "mg" },
	{ label: "Mystery, Thriller, & Suspense", value: "mts" },
	{ label: "New Adult", value: "na" },
	{ label: "Other Nonfiction", value: "nonfiction"},
	{ label: "Plays", value: "plays" },
	{ label: "Poetry", value: "poetry"},
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
      genresWrite: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleGenreWriteSelectChange = this.handleGenreWriteSelectChange.bind(this);
    this.handleGenreReadSelectChange = this.handleGenreReadSelectChange.bind(this);
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.currentUser.uid}`);
    this.genresWriteRef = firebaseDB.database().ref(`/Users/${this.state.currentUser.uid}/genresWrite`);
    this.genresReadRef = firebaseDB.database().ref(`/Users/${this.state.currentUser.uid}/genresRead`);
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
	      website: currentUser.website ? currentUser.website : "",
      });
    });
    this.genresWriteRef.on('value', snapshot => {
    	let genresWriteHash = snapshot.val()
    	let selectedGenresWrite = []
    	for (let genre in genresWriteHash) {
    		if (genresWriteHash[genre]) {
    			selectedGenresWrite.push(genre)
    		}
    	}
    	this.setState({
    		genresWrite: selectedGenresWrite
    	})
    })
    this.genresReadRef.on('value', snapshot => {
    	console.log(snapshot.val())
    	let genresReadHash = snapshot.val()
    	let selectedGenresRead = []
    	for (let genre in genresReadHash) {
    		if (genresReadHash[genre]) {
    			selectedGenresRead.push(genre)
    		}
    	}
    	this.setState({
    		genresRead: selectedGenresRead
    	})
    })
  }

  handleGenreWriteSelectChange (value) {
		this.setState({
			genresWrite: value 
		});
	}

	handleGenreReadSelectChange (value) {
		this.setState({
			genresRead: value
		})
	}

  componentWillUnmount() {
		this.userRef.off();
		this.genresWriteRef.off();
		this.genresReadRef.off();
  }

  updateUserProfile(event) {
    event.preventDefault()
    for (let genreKey in GENRES) {
    	let genre = GENRES[genreKey].value
    	let genresWriteString = this.state.genresWrite
    	if (genresWriteString.length > 0 && genresWriteString.split(',').includes(genre)) {
				this.genresWriteRef.update({
					[genre] : true
				})
			}
			else {
				this.genresWriteRef.update({
					[genre] : false
				})
    	}
    	let genresReadString = this.state.genresRead
    	if (genresReadString.length > 0 && genresReadString.split(',').includes(genre)) {
				this.genresReadRef.update({
					[genre] : true
				})
			}
			else {
				this.genresReadRef.update({
					[genre] : false
				})
			}	
    }
	  this.userRef.update({
      displayName: this.state.displayName,
	    lfr: this.state.lfr,
	    ltr: this.state.ltr,
	    bio: this.state.bio,
	    location: this.state.location,
	    occupation: this.state.occupation,
	    website: this.state.website,
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
									onChange={this.handleGenreWriteSelectChange}
									options={GENRES}
									placeholder="Select your favorite(s)"
									simpleValue
									value={this.state.genresWrite}
								/>
							</label>
							<label className="pt-label">
		          	Genres I Read
			          <Select
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

		          <input type="submit" className="pt-button pt-intent-primary" value="Save"></input>
		        </form>
		      </div>
	      </BrowserRouter>
      </div>
    )
  }
}

export default EditProfileForm