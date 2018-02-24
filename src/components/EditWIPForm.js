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
]

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


class EditWIPForm extends Component {
	constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      currentUser: firebaseDB.auth().currentUser,
      WIPId: this.props.match.params.wipId,
      title: "",
      wordCount: "",
      genres: "",
      logline: "",
      draft: "",
      types: "",
      language: "",
      disclaimers: "",
      improvementAreas: "",
      blurb: "",
      additionalNotes: ""

    }
    this.WIPRef = firebaseDB.database().ref(`WIPs/${this.state.WIPId}`);
    this.genresRef = firebaseDB.database().ref(`/WIPs/${this.state.WIPId}/genres`);
    this.typesRef = firebaseDB.database().ref(`/WIPs/${this.state.WIPId}/types`);
    this.handleChange = this.handleChange.bind(this);
    this.handleGenreSelectChange = this.handleGenreSelectChange.bind(this);
    this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  componentDidMount() {
    this.WIPRef.on('value', snapshot => {
    	let WIP = snapshot.val()
      this.setState({
        title: WIP.title ? WIP.title : "",
        wordCount: WIP.wc ? WIP.wc : "",
        logline: WIP.logline ? WIP.logline : "",
        draft: WIP.draft ? WIP.draft : "",
        language: WIP.language ? WIP.language : "",
        disclaimers: WIP.disclaimers ? WIP.disclaimers : "",
        improvementAreas: WIP.improvementAreas ? WIP.improvementAreas : "",
        blurb: WIP.blurb ? WIP.blurb : "",
        additionalNotes: WIP.additionalNotes ? WIP.additionalNotes : ""
      });
    });
    this.genresRef.on('value', snapshot => {
			let genresHash = snapshot.val()
			let selectedGenres = []
			for (let genre in genresHash) {
				if (genresHash[genre]) {
    			selectedGenres.push(genre)
    		}
    	}
    	this.setState({
    		genres: selectedGenres.join(',')
    	})
    })
    this.typesRef.on('value', snapshot => {
    	let typesHash = snapshot.val()
    	let selectedTypes = []
    	for (let WIPType in typesHash) {
    		if (typesHash[WIPType]) {
    			selectedTypes.push(WIPType)
    		}
    	}
    	this.setState({
    		types: selectedTypes.join(',')
    	})
    })
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


  updateWIP(event) {
		event.preventDefault()
		this.WIPRef.update({
			title: this.state.title,
			wc: this.state.wordCount,
			logline: this.state.logline,
			draft: this.state.draft,
			language: this.state.language,
			disclaimers: this.state.disclaimers,
			improvementAreas: this.state.improvementAreas,
			blurb: this.state.blurb,
			additionalNotes: this.state.additionalNotes

		})
		this.EditWIPForm.reset()
    this.setState({ redirect: true })
    for (let genreKey in GENRES) {
    	let genre = GENRES[genreKey].value
    	let genresString = this.state.genres
    	if (genresString.length > 0 && genresString.split(',').includes(genre)) {
				this.genresRef.update({
					[genre] : true
				})
			}
			else {
				this.genresRef.update({
					[genre] : false
				})
    	}
    }
    for (let typeKey in TYPES) {
    	let WIPType = TYPES[typeKey].value
    	let typesString = this.state.types
    	if (typesString.length > 0 && typesString.split(',').includes(WIPType)) {
    		this.typesRef.update({
    			[WIPType] : true
    		})
    	} else {
    		this.typesRef.update({
    			[WIPType] : false
    		})
    	}
    }
  }

  componentWillUnmount() {
		this.WIPRef.off();
		this.genresRef.off();
		this.typesRef.off();
  }

  render() {
  	if (this.state.redirect === true) {
      return <Redirect to= {{pathname: '/wip/' + this.state.WIPId}} />
    }
    return (
    	<div>
	    	<BrowserRouter>
		      <div style={{marginTop: "100px"}}>
		        <form onSubmit={(event) => this.updateWIP(event)} ref={(form) => this.EditWIPForm = form}>
		          <label className="pt-label">
		            Title
		            <input className="pt-input" value={this.state.title} name="title" onChange={this.handleChange} type="text" placeholder={this.state.title} ></input>
		          </label>
		          <label className="pt-label">
		            Logline
		            <input className="pt-input" value={this.state.logline} name="logline" type="text" onChange={this.handleChange} ></input>
		          </label>
		          <label className="pt-label">
		            Draft
		            <input className="pt-input" value={this.state.draft} name="draft" type="text" onChange={this.handleChange} ></input>
		          </label>
		          <label className="pt-label">
		            Word Count
		            <input className="pt-input" value={this.state.wordCount} name="wordCount" onChange={this.handleChange} type="number" placeholder={this.state.wordCount} ></input>
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
		          	Genres
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
		          	Types
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
		          <input type="submit" className="pt-button pt-intent-primary" value="Save"></input>
		        </form>
		      </div>
	      </BrowserRouter>
      </div>
    )
  }
}

export default EditWIPForm
