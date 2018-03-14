import React, { Component } from 'react';
import UserSearchItem from './UserSearchItem';
import WIPSearchItem from './WIPSearchItem';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';
import { Checkbox, TextArea, RadioGroup, Radio } from "@blueprintjs/core";
import {Index, InstantSearch, Hits, Highlight, SearchBox, RefinementList, ClearRefinements, CurrentRefinements, ToggleRefinement, PoweredBy} from 'react-instantsearch/dom';
import { connectToggleRefinement } from 'react-instantsearch/connectors';

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

class UserSearch extends Component {

	constructor() {
    super()
      this.state = {
      redirect: false,
      searchType: "users",
    }

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }	

	// Format of items
	// {
	//   label: string,
	//   value: array<string>,
	//   count: number,
	//   isRefined: bool,
	// }	
	convertGenres(items) {
		items.forEach(item => {
			item.label = genresHash[item.label]
		}) 	
		return items
	}

  handleSearchChange(event) {
    this.setState({ 
      searchType: event.target.value
    });
  }

  handleChange(event) {
    this.setState({ 
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  }

  render() {
    const Toggle = ({ refine, currentRefinement, label }) => (
      <Checkbox checked={currentRefinement} className="input-checkbox form-field-box" label={label} onChange={() => refine(!currentRefinement)} />
    );
    const ToggleRefinement = connectToggleRefinement(Toggle);

	  return (
      <InstantSearch
          appId={process.env.REACT_APP_ALGOLIA_APP_ID}
          apiKey={process.env.REACT_APP_ALGOLIA_API_KEY}
          indexName={this.state.searchType == "users" ? process.env.REACT_APP_ALGOLIA_USERS_INDEX_NAME : process.env.REACT_APP_ALGOLIA_WIPS_INDEX_NAME}
        >
	  	<Grid style={{marginTop: "100px"}}>
        <Row className="search-row">
          <Col sm={1}>
            <RadioGroup
              onChange={this.handleSearchChange}
              selectedValue={this.state.searchType}
            >
            <Radio className="search-type-radio" label="Users" value="users" />
            <Radio className="search-type-radio" label="WIPs" value="wips" />
            </RadioGroup>
          </Col>
          <Col sm={11}>
            <SearchBox 
              translations={{
                placeholder: 'Search users or WIPs',
              }}
              submit={<div>Search</div>}
            />
          </Col>
        </Row>
        <Row className="search-filters-and-results">
          <Col className="search-filters" sm={3}>
            {this.state.searchType == "users" ?
            (
              <div>
                <ToggleRefinement
                  attribute="lfr"
                  label="Looking for Reader"
                  value={true}
                  defaultRefinement={false}
                />
                <ToggleRefinement
                  attribute="ltr"
                  label="Looking to Read"
                  value={true}
                  defaultRefinement={false}
                /> 
                <div className="section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Genres User Reads
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <RefinementList 
                attribute="genresRead" 
                operator="or" 
                transformItems={items => this.convertGenres(items)}
                />
                <div className="section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Genres User Writes
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <RefinementList 
                  attribute="genresWrite" 
                  operator="or" 
                	transformItems={items => this.convertGenres(items)}
                />
              </div>
            ) 
            :
            (
              <div>
                <div className="section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Genres
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <RefinementList 
                  attribute="genres" 
                  operator="or" 
                	transformItems={items => this.convertGenres(items)}
                />
                <div className="section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Types
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <RefinementList 
                  attribute="types" 
                  operator="or" 
                />
                <div className="section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Language
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <RefinementList 
                  attribute="language" 
                  operator="or" 
                />
              </div>
            )
          }
          <ClearRefinements
            clearsQuery
            translations={{
              reset: 'Clear Search'
            }}
          />
          <PoweredBy />
          </Col>
          <Col className="search-results" sm={9}>
            {this.state.searchType == "users" ?
            (
      	      <Index indexName={process.env.REACT_APP_ALGOLIA_USERS_INDEX_NAME}>
              	<Hits hitComponent={UserSearchItem}/>
      	      </Index>
            )
            :
            (
      	      <Index indexName={process.env.REACT_APP_ALGOLIA_WIPS_INDEX_NAME}>
              	<Hits hitComponent={WIPSearchItem}/>
      	      </Index>
            )
          }
          </Col>
        </Row>        
			</Grid>
      </InstantSearch>
	  );

  }
}

export default UserSearch;