import React, { Component } from 'react';
import { Router, Route, Redirect, Switch, Link } from 'react-router-dom';
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
import NoMatch from './NoMatch';
import About from './About';
import CookiePolicy from './CookiePolicy';
import { firebaseDB } from './base';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import CookieConsent from "react-cookie-consent";

var history = createBrowserHistory();

const PrivateRoute = ({ isLoggedIn, ...props }) =>
  isLoggedIn
    ? <Route { ...props } />
    : <Redirect to="/login" />

class App extends Component {
  constructor() {
    super();
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.setCurrentUserId = this.setCurrentUserId.bind(this);
    this.enableGACookies = this.enableGACookies.bind(this);
    this.state = {
      authenticated: false,
      loading: true,
      currentUser: null,
      currentUserId: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : ""
    };
  }

  componentWillMount() {
    this.removeAuthListener = firebaseDB.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false
        })
        var userRef = firebaseDB.database().ref(`Users/${user.uid}`)
        var amOnline = firebaseDB.database().ref(`.info/connected`);
        amOnline.on('value', function(snapshot) {
          if (snapshot.val()) {
            userRef.update({
              lastActive: Date.now()
            })
          }
        });
        setTimeout(
          function() {
              firebaseDB.auth().signOut()
          },
          8640000
        );
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false
        })
      }
    })
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

  componentWillUnmount() {
    this.removeAuthListener();
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

  enableGACookies() {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID);

    history.listen(function (location) {
      ReactGA.pageview(window.location.pathname + window.location.search);
    });
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
      <Router history={history}>
        <div className="main-app">
          <Header 
            authenticated={this.state.authenticated} 
            currentUserId={this.state.currentUserId}
          />
          <Switch>
            <PrivateRoute 
              isLoggedIn={this.state.authenticated} 
              exact path="/" 
              render={(props) => {
                return <HomePage authenticated={this.state.authenticated} {...props} />
              }}
            />
            <PrivateRoute 
              isLoggedIn={this.state.authenticated}
              exact path="/homepage"
              render={(props) => {
                return <HomePage authenticated={this.state.authenticated} {...props} />
              }}
            />
            <Route 
              exact path="/login" 
              render={(props) => {
                return <Login 
                        setCurrentUser={this.setCurrentUser} 
                        setCurrentUserId = {this.setCurrentUserId} 
                        authenticated={this.state.authenticated} {...props} />
              }}
            />
            <Route 
              exact path="/logout" 
              component={Logout} 
            />
            <PrivateRoute 
              isLoggedIn={this.state.authenticated}
              exact path="/search"
              component={Search}
            />
            <PrivateRoute 
              isLoggedIn={this.state.authenticated}
              exact path="/forum"
              component={Forum}/>
            <PrivateRoute 
              isLoggedIn={this.state.authenticated} 
              exact path="/user/:id" 
              component={UserProfile}
              currentUserId={this.state.currentUserId}
            />
            <PrivateRoute
              isLoggedIn={this.state.authenticated} 
              path="/wip/:wipId" 
              component={WIP}
              currentUserId={this.state.currentUserId}
            />
            <PrivateRoute
              isLoggedIn={this.state.authenticated}
              exact path="/submit_wip/:userId"
              render={(props) => {
                return <NewWIPForm 
                         authenticated={this.state.authenticated} 
                         currentUserId={this.state.currentUserId} {...props} />
              }}
            />
            <PrivateRoute
              isLoggedIn={this.state.authenticated}
              exact path="/edit_profile" 
              render={(props) => {
                return <EditProfileForm 
                         authenticated={this.state.authenticated} 
                         currentUserId={this.state.currentUserId} {...props} />
              }}
            />
            <PrivateRoute
              isLoggedIn={this.state.authenticated}
              path="/edit_wip/:wipId" 
              render={(props) => {
                return <EditWIPForm 
                         authenticated={this.state.authenticated} 
                         currentUserId={this.state.currentUserId} {...props} />
              }}
            />
            <PrivateRoute
              isLoggedIn={this.state.authenticated}
              exact path="/submit_thread" 
              render={(props) => {
                return <NewThreadForm 
                         authenticated={this.state.authenticated} 
                         currentUserId={this.state.currentUserId} {...props} />
              }}
            />
            <PrivateRoute
              isLoggedIn={this.state.authenticated} 
              path="/thread/:threadId" 
              component={Thread} 
              currentUserId={this.state.currentUserId}
            />
            <Route
              exact path="/about"
              component={About}
            />
            <Route
              exact path="/cookie_policy"
              component={CookiePolicy}
            />
            <Route component={NoMatch} />
          </Switch>
          <CookieConsent
            location="bottom"
            buttonText="Accept All Cookies"
            cookieName="cc_cookie_notice"
            style={
              { 
                background: "rgba(0,0,0,0.8)", 
                letterSpacing: "0.1em",
                paddingLeft: "10px", 
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }
            }
            contentStyle={
              {
                flex: "none"
              }
            }
            buttonStyle={
              { 
                color: "black", 
                backgroundColor: "white", 
                fontSize: "13px",
                padding: "10px"
              }
            }
            expires={150}
            onAccept={() => {this.enableGACookies()}}
          >
            This website uses cookies to enhance the user experience.{" "}
            <Link to={"/cookie_policy"}>Read more about cookies here.</Link>
          </CookieConsent>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
