import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './SplashPage.css';

class SplashPage extends Component {
  render() {
    return (
      <div class="splash-page">
      <center><h1 class="title">Critique Connect</h1></center>
      <center><Link className="pt-button pt-intent-primary" to="/login">Register/Log In</Link></center>
      </div>
    );
  }
}

export default SplashPage;