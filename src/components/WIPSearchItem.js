import React, { Component } from 'react';
import {Highlight} from 'react-instantsearch/dom';
import { Link } from 'react-router-dom';
import * as constants from '../constants';

class WIPSearchItem extends Component {
	constructor(props){
    super(props)
    this.state = {
      redirect: false,
      hit: this.props.hit,
      objectId: this.props.hit.objectID,
      title: this.props.hit.title,
      types: this.props.hit.types || [],
      wc: this.props.hit.wc,
      genres: this.props.hit.genres || [],
      logline: this.props.hit.logline
    }
  }

  render() {

    return (

      <div style={{marginTop: '10px'}}>
      	<Link to={"/wip/" + this.state.objectId}>
	        <div className="wip-summary">
	        	<div className="wip-name">
	          	<Highlight 
                className="wip-name-text" 
                attribute="title" 
                hit={this.state.hit}
              />
	          </div>
            <div className="wip-types-text">
              {this.state.types.join(', ')}
            </div>
            {(this.state.wc && this.state.types.length > 0) && (
              <span>&nbsp;|&nbsp;</span>
            )}
            {this.state.wc && (
              <div className="wip-wc-text">
                {this.state.wc} words
              </div>
            )}
            {this.state.genres.map((genre) => {
              return (
                <div className="wip-genre-text" key={genre}>
                  {constants.GENRES_HASH[genre]}
                </div>
              )
            })}
            <div className="wip-logline-text">
              {this.state.logline}
            </div>
          </div>
	      </Link>
      </div>
    );
  }
}

export default WIPSearchItem;
