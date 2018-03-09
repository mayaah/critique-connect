import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Logout from './components/Logout';
import UserSearchItem from './components/UserSearchItem';
import './HomePage.css';
import {InstantSearch, Hits, Highlight,SearchBox, RefinementList, ClearRefinements, CurrentRefinements, ToggleRefinement} from 'react-instantsearch/dom';


class HomePage extends Component {
  constructor() {
    super()
      this.state = {
      redirect: false
    }
  }	

  render() {
    return (
    	<div>
        	<BrowserRouter>
    			<div style={{marginTop: "100px"}}>
           <InstantSearch
              appId={process.env.REACT_APP_ALGOLIA_APP_ID}
              apiKey={process.env.REACT_APP_ALGOLIA_API_KEY}
              indexName={process.env.REACT_APP_ALGOLIA_USERS_INDEX_NAME}
            >
            <SearchBox 
              translations={{
                placeholder: 'Search users',
              }}
            />
            <CurrentRefinements />
            <RefinementList 
              attribute="genresRead" 
              operator="or" 
              withSearchBox
            />
            <RefinementList 
              attribute="genresWrite" 
              operator="or" 
              withSearchBox
            />
            <ToggleRefinement
              attribute="lfr"
              label="Looking for Reader"
              value="true"
            />
            <ToggleRefinement
              attribute="ltr"
              label="Looking to Read"
              value="true"
            />
            <ClearRefinements
              clearsQuery
              translations={{
                reset: 'Clear Search'
              }}
            />

            <Hits hitComponent={UserSearchItem}/>
            </InstantSearch>
    			</div>
    		</BrowserRouter>
    	</div>
    );
  }
}

export default HomePage;