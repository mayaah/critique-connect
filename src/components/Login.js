import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Toaster, Intent } from "@blueprintjs/core";
import User from '../User';

import { firebaseDB, facebookProvider, googleProvider, twitterProvider } from '../base'

class Login extends Component {
  constructor() {
    super()
    this.authWithFacebook = this.authWithFacebook.bind(this)
    this.authWithGoogle = this.authWithGoogle.bind(this)
    this.state = {
      redirect: false
    }
  }

  authWithFacebook() {
    firebaseDB.auth().signInWithPopup(facebookProvider)
      .then((user, error) => {
        if (error) {
          this.toaster.show({ intent: Intent.DANGER, message: "Unable to sign in with Facebook" })
        } else {
          this.props.setCurrentUser(user)
          this.props.setCurrentUserId()
          this.setState({ redirect: true })
          this.createNewUser()
        }
      })
  }

  authWithGoogle() {
    firebaseDB.auth().signInWithPopup(googleProvider)
      .then((user, error) => {
        if (error) {
          this.toaster.show({ intent: Intent.DANGER, message: "Unable to sign in with Google" })
        } else {
          this.props.setCurrentUser(user)
          this.props.setCurrentUserId()
          this.setState({ redirect: true })
          console.log(user)
          console.log(firebaseDB.auth().currentUser)
          this.createNewUser()
        }
      })
  }

  authWithTwitter() {
    firebaseDB.auth().signInWithPopup(twitterProvider)
      .then((user, error) => {
        if (error) {
          this.toaster.show({ intent: Intent.DANGER, message: "Unable to sign in with Twitter" })
        } else {
          this.props.setCurrentUser(user)
          this.props.setCurrentUserId()
          this.setState({ redirect: true })
          this.createNewUser()
        }
      })
  }

  createNewUser() {
    var user = firebaseDB.auth().currentUser;
    console.log(user.displayName)
    firebaseDB.database().ref(`Users/${user.uid}`).update({
      displayName: user.displayName
    });
  }

  render() {
    const { from } = this.props.authenticated ? { from: { pathname: '/homepage'} } : { from: {pathname: '/'} }
    // if (this.props.state.authenticated) {
    //   const { from } = { from: { pathname: '/homepage'} }
    // } else {
    //   const { from } = { from: {pathname: '/'} }
    // }
    // const { from } = this.props.location.state || { from: { pathname: '/' } }

    if (this.state.redirect === true) {
      return <Redirect to={from} />
    }

    return (
    <div>
      <div className="splash-page">
        {this.props.authenticated
          ? (
            null
            )
          : (
          <div className="login-styles">
            <button className="pt-button pt-intent-primary login-auth g-auth" onClick={() => this.authWithGoogle()}>
              <img src={require('../images/google-icon.png')} />
              <span className="login-button-text">Continue with Google</span>
            </button>
            <button className="pt-button pt-intent-primary login-auth fb-auth" onClick={() => this.authWithFacebook()}>
              <img src={require('../images/fb-icon.png')} />
              <span className="login-button-text">Continue with Facebook</span>
            </button>
            <button className="pt-button pt-intent-primary login-auth t-auth" onClick={() => this.authWithTwitter()}>
              <img src={require('../images/twitter-icon.png')} />
              <span className="login-button-text">Continue with Twitter</span>
            </button>
          </div>
          )
        }
      </div>
    </div>
    )
  }
}

export default Login