import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import NewWIPForm from './NewWIPForm';
import EditProfileForm from './EditProfileForm';
import EditWIPForm from './EditWIPForm';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';

import { firebaseDB, base } from '../base'

const genresHash = {
  adventure: "Adventure",
  cl: "Chick Lit",
  cmrf: "Contemporary, Mainstream, & Realistic",
  children: "Children's",
  erotic: "Erotic",
  fantasy: "Fantasy",
  historical: "Historical",
  hs: "Horror & Supernatural",
  lgbt: "LGBT+",
  literary: "Literary",
  ma: "Memoir & Autobiography",
  mg: "Middle Grade",
  mts: "Mystery, Thriller, & Suspense",
  na: "New Adult",
  nonfiction: "Other Nonfiction",
  rsna: "Religious, Spiritual, & New Age",
  romance: "Romance",
  shp: "Satire, Humor, & Parody",
  sf: "Science Fiction",
  wf: "Women's",
  ya: "Young Adult"
}

const TYPES = [
  { label: "Fiction", value: "Fiction" },
  { label: "Nonfiction", value: "Nonfiction"},
  { label: "Novel", value: "Novel"},
  { label: "Novella", value: "Novella"},
  { label: "Poetry", value: "Poetry"},
  { label: "Short Story", value: "Short Story"},
  { label: "Screenplay", value: "Screenplay"},
  { label: "Anthology", value: "Anthology"}
];

const typesHash = {
  fiction: "Fiction",
  nonfiction: "Nonfiction",
  novella: "Novella",
  poetry: "Poetry",
  ss: "Short Story",
  sp: "Screenplay",
  anthology: "Anthology"
}

const languagesHash = {
  english : "English",
  chinese: "Chinese",
  german: "German",
  spanish: "Spanish",
  japanese: "Japanese",
  russian: "Russian",
  french: "French",
  korean: "Korean",
  italian: "Italian",
  dutch: "Dutch",
  portuguese: "Portuguese",
  hindi: "Hindi",
  other: "Other"
}

class WIP extends Component {
	constructor(props){
    super(props)
    this.state = {
      redirect: false,
      wipId: this.props.match.params.wipId,
      writer: "",
      title: "",
      wordCount: "",
      genres: [],
      logline: "",
      types: [],
      language: "",
      draft: "",
      disclaimers: "",
      improvementAreas: "",
      blurb: "",
      additionalNotes: ""
    }
    this.WIPRef = firebaseDB.database().ref(`WIPs/${this.state.wipId}`);
  }

  componentDidMount() {
  	this.WIPRef.on('value', snapshot => {
  		let WIP = snapshot.val()
      // let returnedTypes = []
      // if (WIP.types != null) {
      //   var types = Object.keys(WIP.types) || []
      //   var filteredTypes = types.filter(function(type) {
      //     return WIP.types[type]
      //   })
      //   returnedTypes = filteredTypes
      // }
      // let returnedGenres = []
      // if (WIP.genres != null) {
      //   var genres = Object.keys(WIP.genres) || []
      //   var filteredGenres = genres.filter(function(genre) {
      //     return WIP.genres[genre]
      //   })
      //   returnedGenres = filteredGenres
      // }
  		this.setState({
        title: WIP.title ? WIP.title : "",
        wordCount: WIP.wc ? WIP.wc : "",
        logline: WIP.logline ? WIP.logline : "",
        draft: WIP.draft ? WIP.draft : "",
        language: WIP.language ? WIP.language : "",
        disclaimers: WIP.disclaimers ? WIP.disclaimers : "",
        improvementAreas: WIP.improvementAreas ? WIP.improvementAreas : "",
        blurb: WIP.blurb ? WIP.blurb : "",
        additionalNotes: WIP.additionalNotes ? WIP.additionalNotes : "",
        writer: WIP.writer ? WIP.writer : "",
        genres: WIP.genres ? WIP.genres : [],
        types: WIP.types ? WIP.types : []
      });
  	})
  }

  componentWillUnmount() {
  	this.WIPRef.off();
  }

  removeWIP(WIPId) {
    this.setState({ redirect: true })
    this.WIPRef.remove();
    const usersWIPRef = firebaseDB.database().ref(`/Users/${this.state.writer}/WIPs/${this.state.wipId}`)
    usersWIPRef.remove();
  }

	render() {
    if (this.state.redirect === true) {
      return <Redirect to= {{pathname: '/user/' + this.state.writer}} />
    }
    return (
	  	<Grid className="wip-page" style={{marginTop: "100px"}}>
	  		<Row className="wip-header">
	  			<Col sm={12}>
	  				<div className="wip-title">{this.state.title}</div>
            <div className="wip-buttons flex">
              <Button className="black-bordered-button" block>
                <Link className="flex" to={"/edit_wip/" + this.state.wipId} >
                <Image src={require('../images/pencil-black.png')} responsive />
                <span className="edit-wip-text">Edit WIP</span>
                </Link>
              </Button>
              <Button className="black-bordered-button" onClick={() => this.removeWIP(WIP.id)}>Remove Item</Button>
            </div>
            <div className="wip-logline">{this.state.logline}</div>
	  			</Col>
	  		</Row>
        <Row>
          <Col className="wip-left-col" sm={4}>
            <div className="section-divider small-section-divider">
              <span className="section-divider-title small-section-divider-title">
                Wordcount
              </span>
              <div className="section-divider-hr"></div>
            </div>
            <div className="small-field-text">{this.state.wordCount} words</div>
            <div className="section-divider small-section-divider">
              <span className="section-divider-title small-section-divider-title">
                Language
              </span>
              <div className="section-divider-hr"></div>
            </div>
            <div className="small-field-text">{this.state.language}</div>
            <div className="section-divider small-section-divider">
              <span className="section-divider-title small-section-divider-title">
                Type(s)
              </span>
              <div className="section-divider-hr"></div>
            </div>
            <div className="display-field-list">
              <div className="wrapper">
                  {this.state.types.map((type) => {
                    return (
                      <div className="small-field-text">{type}</div>
                    )
                  })}
              </div>
            </div>
            <div className="section-divider small-section-divider">
              <span className="section-divider-title small-section-divider-title">
                Genre(s)
              </span>
              <div className="section-divider-hr"></div>
            </div>
            <div className="display-field-list">
              <div className="wrapper">
                  {this.state.genres.map((genre) => {
                    return (
                      <div className="small-field-text">{genresHash[genre]}</div>
                    )
                  })}
              </div>
            </div>
            <div className="section-divider small-section-divider">
              <span className="section-divider-title small-section-divider-title">
                Draft
              </span>
              <div className="section-divider-hr"></div>
            </div>
            <div className="small-field-text">{this.state.draft}</div>
            <div className="section-divider small-section-divider">
              <span className="section-divider-title small-section-divider-title">
                Disclaimers
              </span>
              <div className="section-divider-hr"></div>
            </div>
            <div className="small-field-text">{this.state.disclaimers}</div>
            <div className="section-divider small-section-divider">
              <span className="section-divider-title small-section-divider-title">
                Improvement Areas
              </span>
              <div className="section-divider-hr"></div>
            </div>
            <div className="small-field-text">{this.state.improvementAreas}</div>
          </Col>
          <Col className="wip-right-col" sm={8}>
            <div className="section-divider">
              <span className="section-divider-title">
                Blurb
              </span>
              <div className="section-divider-hr"></div>
            </div>
            <div className="section-long-text">{this.state.blurb}</div>
            <div className="section-divider">
              <span className="section-divider-title">
                Additional Notes
              </span>
              <div className="section-divider-hr"></div>
            </div>
            <div className="section-long-text">{this.state.additionalNotes}</div>
          </Col>
        </Row>
	  	</Grid>
	   );
  }
}

export default WIP
