import React, { Component } from 'react';
import {Highlight} from 'react-instantsearch/dom';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';


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
	          	<Highlight className="wip-name-text" attribute="title" hit={this.state.hit} />
	          </div>
            <div className="wip-types-text">{this.state.types.join(', ')} |&nbsp;</div><div className="wip-wc-text">{this.state.wc} words</div>
            {this.state.genres.map((genre) => {
              return (
                <div className="wip-genre-text">{genresHash[genre]}</div>
              )
            })}
            <div className="wip-logline-text">{this.state.logline}</div>
          </div>
	      </Link>
      </div>
    );

  }
}

export default WIPSearchItem;