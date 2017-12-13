import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Header from './components/Header';
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
    			<div>
    			Fjidajfida
    				<Header authenticated={this.props.authenticated} />
    			</div>
    		</BrowserRouter>
    	</div>
    );
  }
}

export default HomePage;