import React, { Component } from 'react';
import {Highlight} from 'react-instantsearch/dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Grid, Row, Col, Image, Label } from 'react-bootstrap';


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

const defaultAvatarUrl = "https://firebasestorage.googleapis.com/v0/b/critique-connect.appspot.com/o/images%2Fcc-default.jpg?alt=media&token=f77a0196-df38-4a46-8b95-24d611c967cd"

class UserSearchItem extends Component {
	constructor(props){
    super(props)
    this.state = {
      redirect: false,
      hit: this.props.hit,
      objectId: this.props.hit.objectID,
      lfr: this.props.hit.lfr,
      ltr: this.props.hit.ltr,
      genresWrite: this.props.hit.genresWrite || [],
      genresRead: this.props.hit.genresRead || [],
      lastLogin: this.props.hit.lastLogin,
      compensation: this.props.hit.compensation,
      avatarURL: this.props.hit.avatarURL || defaultAvatarUrl
    }
  }

  render() {

    return (

      <div style={{marginTop: '10px'}}>
      		<Link to={"/user/" + this.state.objectId}>
      			<Row className="user-search-summary flex">
      				<Col sm={2} className="flex">
                <div className="user-search-img-container">
                  <Image 
                    className="user-search-img" 
                    src={this.state.avatarURL} 
                    responsive
                  />
                </div>
      				</Col>
      				<Col sm={10}>
			        	<div className="user-name-and-labels">
				          <Highlight 
                    className="search-name" 
                    attribute="displayName" 
                    hit={this.state.hit} 
                  />
				          {this.state.lfr ? (
                    <Label 
                      className="looking-labels-small" 
                      id="lfr-label"
                    >
                      Is Looking for a Reader
                    </Label>
                  ) : (
                    null 
                  )}
			            {this.state.ltr ?  (
                    <Label 
                      className="looking-labels-small" 
                      id="ltr-label"
                    >
                      Is Looking to Read
                    </Label>
                  ) : (
                    null 
                  )}
		          	</div>
                {this.state.lastLogin && (
  		          	<div className="user-search-result">
  		            	<span className="user-search-result-field">
                      Last active:&nbsp;
                    </span>
                    <span className="user-search-result-value">
                      {this.state.lastLogin}
                    </span> 
  		            </div>
                )}
                {this.state.compensation && (
  		            <div className="user-search-result">
  		            	<span className="user-search-result-field">
                      Critique compensation type:&nbsp;
                    </span>
                    <span className="user-search-result-value">
                      {this.state.compensation}
                    </span>
  		            </div>
                )}
                {this.state.genresWrite[0] && (
  		            <div className="user-search-result">
  		            	<span className="user-search-result-field">
                      Genres I Write:&nbsp;
                    </span>
                    <span className="wip-genre-text">
                      {this.state.genresWrite.map(genre => genresHash[genre]).join(', ')}
                    </span>
  		            </div>
                )}
                {this.state.genresRead[0] && (
  		            <div className="user-search-result">
  		            	<span className="user-search-result-field">
                      Genres I Read:&nbsp;
                    </span>
                    <span className="wip-genre-text">
                      {this.state.genresRead.map(genre => genresHash[genre]).join(', ')}
                    </span>
  		            </div>
                )}
				      </Col>
			      </Row>
		      </Link>
      </div>
    );
  }
}

export default UserSearchItem;
