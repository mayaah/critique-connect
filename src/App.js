import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Logout from './components/Logout';
import HomePage from './HomePage';
import UserProfile from './components/UserProfile';
import NewWIPForm from './components/NewWIPForm';

import { firebaseDB, base } from './base'

function AuthenticatedRoute({component: Component, authenticated, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
          ? <Component {...props} {...rest} />
          : <Redirect to={{pathname: '/login', state: {from: props.location}}} /> } />
  )
}


class App extends Component {
   constructor() {
    super();
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.setCurrentUserId = this.setCurrentUserId.bind(this);
    this.state = {
      authenticated: false,
      loading: true,
      currentUser: null,
      currentUserId: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : ""
    };
  }

  setCurrentUser(user) {
    if (user) {
      this.setState({
        currentUser: user,
        authenticated: true
      })
    } else {
      this.setState({
        currentUser: null,
        authenticated: false
      })
    }
  }

  setCurrentUserId() {
    if (firebaseDB.auth().currentUser) { 
      this.setState({
        currentUserId: firebaseDB.auth().currentUser.uid
      })
    }
  }

  componentDidMount() {
    firebaseDB.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false,
          currentUserId: user.uid
        })
      } 
    })
  }

  componentWillMount() {
    this.removeAuthListener = firebaseDB.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false
        })
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false
        })
      }
    })
  }

  componentWillUnmount() {
    this.removeAuthListener();
  }

  render() {
    if (this.state.loading === true) {
      return (
        <div style={{ textAlign: "center", position: "absolute", top: "25%", left: "50%" }}>
          <h3>Loading</h3>
          <Spinner />
        </div>
      )
    }

    return (
       <div>
        <BrowserRouter>
          <div>
            <Header authenticated={this.state.authenticated} currentUserId={this.state.currentUserId}/>
            <Route exact path="/homepage" render={(props) => {
                return <HomePage authenticated={this.state.authenticated} {...props} />
              }} />
            <Route exact path="/login" render={(props) => {
                return <Login setCurrentUser={this.setCurrentUser} setCurrentUserId = {this.setCurrentUserId} authenticated={this.state.authenticated} {...props} />
              }} />
            <Route exact path="/logout" component={Logout}/>
            <Route path="/user/:id" component={UserProfile}/>
            <Route exact path="/submit_wip" render={(props) => {
              return <NewWIPForm authenticated={this.state.authenticated} {...props} />
            }} />
            {this.state.authenticated ? (<Redirect to="/homepage" />) :  (<Redirect to="/login" />)}
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
