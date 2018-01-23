import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Logout from './components/Logout';
import './HomePage.css';

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
    			Search
				<Header authenticated={this.props.authenticated} />
				<Route exact path="/logout" component={Logout}/>
    			</div>
    		</BrowserRouter>
    	</div>
    );
  }
}

export default HomePage;