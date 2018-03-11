import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Logout from './components/Logout';
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
          </div>
    		</BrowserRouter>
    	</div>
    );
  }
}

export default HomePage;