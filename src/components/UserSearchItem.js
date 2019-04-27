import React, { Component } from 'react';
import {Highlight} from 'react-instantsearch/dom';
import { Link } from 'react-router-dom';
import { Row, Col, Image, Label } from 'react-bootstrap';
import * as constants from '../constants';

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
      lastActive: this.props.hit.lastActive,
      compensation: this.props.hit.compensation,
      avatarURL: this.props.hit.avatarURL || constants.DEFAULT_AVATAR_URL,
      openToPaying: this.props.hit.openToPaying || false
    }
    this.simplifyDate = this.simplifyDate.bind(this);
  }

  simplifyDate(date) {
    let dateArray = date.split(" ")
    let dateOnly = dateArray.slice(1, 4)
    return dateOnly.join(" ")
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
                      Looking for a Reader
                    </Label>
                  ) : (
                    null 
                  )}
			            {this.state.ltr ?  (
                    <Label 
                      className="looking-labels-small" 
                      id="ltr-label"
                    >
                      Looking to Read
                    </Label>
                  ) : (
                    null 
                  )}
		          	</div>
                {this.state.compensation && (
  		            <div className="user-search-result">
  		            	<span className="user-search-result-field">
                      Critique Compensation:&nbsp;
                    </span>
                    <span className="user-search-result-value">
                      {this.state.compensation}
                    </span>
  		            </div>
                )}
                {this.state.openToPaying && (
                  <div className="user-search-result">
                    <span className="user-search-result-field">
                      I'm Open to Paying for Critiques
                    </span>
                  </div>
                )}
                {this.state.genresWrite[0] && (
  		            <div className="user-search-result">
  		            	<span className="user-search-result-field">
                      Genres I Write:&nbsp;
                    </span>
                    <span className="wip-genre-text">
                      {this.state.genresWrite.map(genre => constants.GENRES_HASH[genre]).join(', ')}
                    </span>
  		            </div>
                )}
                {this.state.genresRead[0] && (
  		            <div className="user-search-result">
  		            	<span className="user-search-result-field">
                      Genres I Read:&nbsp;
                    </span>
                    <span className="wip-genre-text">
                      {this.state.genresRead.map(genre => constants.GENRES_HASH[genre]).join(', ')}
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
