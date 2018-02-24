import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { Checkbox, TextArea } from "@blueprintjs/core";
import Select from 'react-select';

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

const TYPES = [
	{ label: "Fiction", value: "fiction" },
	{ label: "Nonfiction", value: "nonfiction"},
	{ label: "Novella", value: "novella"},
	{ label: "Poetry", value: "poetry"},
	{ label: "Short Story", value: "ss"},
	{ label: "Screenplay", value: "sp"},
	{ label: "Anthology", value: "anthology"}
];

const LANGUAGES = [
	{ label: "English", value: "english" },
	{ label: "Chinese", value: "chinese"},
	{ label: "German", value: "german" },
	{ label: "Spanish", value: "spanish" },
	{ label: "Japanese", value: "japanese" },
	{ label: "Russian", value: "russian" },
	{ label: "French", value: "french" },
	{ label: "Korean", value: "korean" },
	{ label: "Italian", value: "italian" },
	{ label: "Dutch", value: "dutch" },
	{ label: "Portuguese", value: "portuguese" },
	{ label: "Hindi", value: "hindi"},
	{ label: "Other", value: "other"}
]


class NewWIPForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      userId: this.props.match.params.userId,
      title: "",
      wordCount: "",
      genres: "",
      types: "",
      logline: "",
      language: "",
      draft: "",
      disclaimers: "",
      improvementAreas: "",
      blurb: "",
      additionalNotes: ""
    }
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.userId}`)
    this.WIPsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/WIPs`)
    this.handleChange = this.handleChange.bind(this);
    this.handleGenreSelectChange = this.handleGenreSelectChange.bind(this);
    this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.createWIP = this.createWIP.bind(this);
  }

  componentWillMount() {
  	this.createWIP = this.createWIP.bind(this)
    this.addWIPToUser = this.addWIPToUser.bind(this)
  }

  componentWillUnmount() {
  	this.userRef.off();
  	this.WIPsRef.off();
  }

  handleChange(event) {
  	console.log(event.target.name)
    console.log(event.target.value)
    this.setState({ 
    	[event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  }

  handleGenreSelectChange(value) {
		this.setState({
			genres: value
		})
	}

	handleTypeSelectChange(value) {
		this.setState({
			types: value
		})
	}

	handleLanguageChange(value) {
		this.setState({
			language: value,
		});
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
	    additionalNotes: this.state.additionalNotes
	  }
	  var newWIPRef = WIPsRef.push(WIP);
	  var WIPId = newWIPRef.key;
	  this.WIPGenresRef = firebaseDB.database().ref(`/WIPs/${WIPId}/genres`)
	  for (let genreKey in GENRES) {
    	let genre = GENRES[genreKey].value
    	let genresString = this.state.genres
    	if (genresString.length > 0 && genresString.split(',').includes(genre)) {
				this.WIPGenresRef.update({
					[genre] : true
				})
			}
			else {
				this.WIPGenresRef.update({
					[genre] : false
				})
    	}
    }
    this.WIPTypesRef = firebaseDB.database().ref(`/WIPs/${WIPId}/types`)
    for (let WIPTypeKey in TYPES) {
    	let WIPType = TYPES[WIPTypeKey].value
    	let typesString = this.state.types
    	if (typesString.length > 0 && typesString.split(',').includes(WIPType)) {
    		this.WIPTypesRef.update({
    			[WIPType] : true
    		})
    	}
    }
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
  	if (this.state.redirect === true) {
      return <Redirect to= {{pathname: '/user/' + this.state.userId}} />
    }
    return (
    	<div>
	    	<BrowserRouter>
		      <div style={{marginTop: "100px"}}>
		        <form onSubmit={(event) => this.createWIP(event)} ref={(form) => this.WIPForm = form}>
		          <label className="pt-label">
		            WIP Title
		            <input className="pt-input" value={this.state.title} name="title" type="text" onChange={this.handleChange}  placeholder="Staying Alive"></input>
		          </label>
		          <label className="pt-label">
		            Word Count
		            <input className="pt-input" value={this.state.wordCount} name="wordCount" type="number" onChange={this.handleChange} ></input>
		          </label>
		          <label className="pt-label">
		            Logline
		            <input className="pt-input" value={this.state.logline} name="logline" type="text" onChange={this.handleChange} ></input>
		          </label>
		          <label className="pt-label">
		            Draft
		            <input className="pt-input" value={this.state.draft} name="draft" type="text" onChange={this.handleChange} ></input>
		          </label>
		          <label className="pt-label bio"> 
	            	Disclaimers 
		            <TextArea large={true} value={this.state.disclaimers} name="disclaimers" onChange={this.handleChange} label="Bio" />
							</label>
							<label className="pt-label bio"> 
	            	Improvement Areas
		            <TextArea large={true} value={this.state.improvementAreas} name="improvementAreas" onChange={this.handleChange} label="Bio" />
							</label>
							<label className="pt-label bio"> 
	            	Blurb 
		            <TextArea large={true} value={this.state.blurb} name="blurb" onChange={this.handleChange} label="Bio" />
							</label>
							<label className="pt-label bio"> 
	            	Additional Notes 
		            <TextArea large={true} value={this.state.additionalNotes} name="additionalNotes" onChange={this.handleChange} label="Bio" />
							</label>
		          <label className="pt-label">
		          	Language
			          <Select
									closeOnSelect={false}
									disabled={false}
									onChange={this.handleLanguageChange}
									options={LANGUAGES}
									placeholder="Select the language"
									simpleValue
									value={this.state.language}
								/>
							</label>
		          <label className="pt-label">
		          	Genre(s)
			          <Select
									closeOnSelect={false}
									disabled={false}
									multi
									onChange={this.handleGenreSelectChange}
									options={GENRES}
									placeholder="Select your favorite(s)"
									simpleValue
									value={this.state.genres}
								/>
							</label>
							<label className="pt-label">
		          	Type(s)
			          <Select
			          	closeOnSelect={false}
									disabled={false}
									multi
									onChange={this.handleTypeSelectChange}
									options={TYPES}
									placeholder="Select the type(s) of literature"
									simpleValue
									value={this.state.types}
								/>
							</label>
		          <input type="submit" className="pt-button pt-intent-primary" value="Submit Work In Progress"></input>
		        </form>
		      </div>
	      </BrowserRouter>
      </div>
    )
  }
}

export default NewWIPForm