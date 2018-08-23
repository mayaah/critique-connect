import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Logout from './components/Logout';
import HomePage from './HomePage';
import UserProfile from './components/UserProfile';
import NewWIPForm from './components/NewWIPForm';
import EditProfileForm from './components/EditProfileForm';
import EditWIPForm from './components/EditWIPForm';
import WIP from './components/WIP';
import Search from './components/Search';
import Forum from './components/Forum';
import NewThreadForm from './components/NewThreadForm';
import Thread from './components/Thread';

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
       <html>
        <BrowserRouter onUpdate={() => window.scrollTo(0, 0)} >
          <div>
            <Header authenticated={this.state.authenticated} currentUserId={this.state.currentUserId}/>
            <Switch>
              <Route exact path="/homepage" render={(props) => {
                  return <HomePage authenticated={this.state.authenticated} {...props} />
                }} />
              <Route exact path="/login" render={(props) => {
                  return <Login setCurrentUser={this.setCurrentUser} setCurrentUserId = {this.setCurrentUserId} authenticated={this.state.authenticated} {...props} />
                }} />
              <Route exact path="/logout" component={Logout}/>
              <Route exact path="/search" component={Search}/>
              <Route exact path="/forum" component={Forum}/>
              <Route path="/user/:id" component={UserProfile} currentUserId={this.state.currentUserId}/>
              <Route path="/wip/:wipId" component={WIP} currentUserId={this.state.currentUserId}/>
              <Route exact path="/submit_wip/:userId" render={(props) => {
                return <NewWIPForm authenticated={this.state.authenticated} currentUserId={this.state.currentUserId} {...props} />
              }} />
              <Route exact path="/edit_profile" render={(props) => {
                return <EditProfileForm authenticated={this.state.authenticated} currentUserId={this.state.currentUserId} {...props} />
              }} />
              <Route path="/edit_wip/:wipId" render={(props) => {
                return <EditWIPForm authenticated={this.state.authenticated} currentUserId={this.state.currentUserId} {...props} />
              }} />
              <Route exact path="/submit_thread" render={(props) => {
                return <NewThreadForm authenticated={this.state.authenticated} currentUserId={this.state.currentUserId} {...props} />
              }} />
               <Route path="/thread/:threadId" component={Thread} currentUserId={this.state.currentUserId}/>
            </Switch>
            {this.state.authenticated ? null :  (<Redirect to="/login" />)}
          </div>
        </BrowserRouter>
      </html>
    );
  }
}

export default App;
