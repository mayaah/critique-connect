import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
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


class NewWIPForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      userId: this.props.match.params.userId,
      title: "",
      wordCount: "",
      genres: "",
      logline: "",
    }
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.userId}`)
    this.WIPsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/WIPs`)
    this.handleChange = this.handleChange.bind(this);
    this.handleGenreSelectChange = this.handleGenreSelectChange.bind(this);
    this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
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

  createWIP(event) {
    event.preventDefault()
		const WIPsRef = firebaseDB.database().ref('WIPs');
	  const WIP = {
	    title: this.state.title,
	    writer: this.state.userId,
	    wc: this.state.wordCount,
	    logline: this.state.logline,
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
    	let WIPType = TYPES[WIPType].value
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