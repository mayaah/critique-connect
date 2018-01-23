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
          this.setState({ redirect: true })
          this.createNewUser()
        }
      })
  }

  createNewUser() {
    var user = firebaseDB.auth().currentUser;
    console.log(user.displayName)
    firebaseDB.database().ref(`Users/${user.uid}`).set({
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
            <button style={{width: "100%"}} className="pt-button pt-intent-primary login-auth g-auth" onClick={() => this.authWithGoogle()}>Log In or Join with Google</button>
            <button style={{width: "100%"}} className="pt-button pt-intent-primary login-auth fb-auth" onClick={() => this.authWithFacebook()}>Log In or Join with Facebook</button>
            <button style={{width: "100%"}} className="pt-button pt-intent-primary login-auth t-auth" onClick={() => this.authWithTwitter()}>Log In or Join with Twitter</button>
          </div>
          )
        }
      </div>
    </div>
    )
  }
}

export default Login