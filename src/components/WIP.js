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
      title: "",
      wordCount: "",
      genres: "",
      logline: "",
      types: "",
      language: "",
    }
    this.WIPRef = firebaseDB.database().ref(`WIPs/${this.state.wipId}`);
  }

  componentDidMount() {
  	this.WIPRef.on('value', snapshot => {
  		let WIP = snapshot.val()
  		this.setState({
        title: WIP.title ? WIP.title : "",
        wordCount: WIP.wc ? WIP.wc : "",
        logline: WIP.logline ? WIP.logline : "",
        types: WIP.type ? WIP.type : "",
        language: WIP.language ? WIP.language : ""
      });
  	})
  }

  componentWillUnmount() {
  	this.WIPRef.off();
  }

	render() {
    return (
	  	<Grid className="wip-page" style={{marginTop: "100px"}}>
	  		<Row className="wip-header">
	  			<Col sm={12}>
	  				<div className="wip-title">{this.state.title}</div>
            <div className="wip-logline">{this.state.logline}</div>
	  			</Col>
	  		</Row>
        <Row>
          <Col className="wip-left-col" sm={4}>
            <div className="wip-field">
              <span className="wip-field-name">WORDCOUNT</span>&nbsp;{this.state.wordCount} words
            </div>
            <div className="wip-field">
              <span className="wip-field-name">LANGUAGE</span>&nbsp;{languagesHash[this.state.language]}
            </div>
          </Col>
          <Col sm={8}>
          </Col>
        </Row>
	  	</Grid>
	   );
  }
}

export default WIP
