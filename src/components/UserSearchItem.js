import React, { Component } from 'react';
import {Highlight} from 'react-instantsearch/dom';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';


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

class UserSearchItem extends Component {
	constructor(props){
    super(props)
    this.state = {
      redirect: false,
      hit: this.props.hit,
      lfr: this.props.hit.lfr,
      ltr: this.props.hit.ltr,
      genresWrite: this.props.hit.genresWrite || [],
      genresRead: this.props.hit.genresRead || [],
      lastLogin: this.props.hit.lastLogin,
      compensation: this.props.hit.compensation
    }
  }

  render() {


    return (

      <div style={{marginTop: '10px'}}>

	        <div className="user-search-summary">
	          <Highlight className="user-search-name" attribute="displayName" hit={this.state.hit} />
	          {this.state.lfr ? 
            	(<Label className="looking-labels" id="lfr-label">Is Looking for a Reader</Label>) :
            	( null )
            }
            {this.state.ltr ? 
              (<Label className="looking-labels" id="ltr-label">Is Looking to Read</Label>) :
              ( null )
            }
            <div className="user-last-active">{this.state.lastLogin}</div> 
            <div className="user-compensation">{this.state.compensation}</div>
            <div className="user-search-genres">
            	<span>Genres Write: </span><span className="wip-genre-text">{this.state.genresWrite.map(genre => genresHash[genre]).join(', ')}</span>
            </div>
            <div className="user-search-genres">
            	<span>Genres Read: </span><span className="wip-genre-text">{this.state.genresRead.map(genre => genresHash[genre]).join(', ')}</span>
            </div>
	          
	        </div>
      </div>
    );

  }
}

export default UserSearchItem;