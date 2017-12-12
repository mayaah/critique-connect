import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Toaster, Intent } from "@blueprintjs/core";

import { app, facebookProvider } from '../base'

const loginStyles = {
  width: "90%",
  maxWidth: "315px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px"
};

class Login extends Component {
  constructor() {
    super()
    this.authWithFacebook = this.authWithFacebook.bind(this)
    this.authWithEmailPassword = this.authWithEmailPassword.bind(this)
    this.state = {
      redirect: false
    }
  }

  authWithFacebook() {
    app.auth().signInWithPopup(facebookProvider)
      .then((user, error) => {
        if (error) {
          this.toaster.show({ intent: Intent.DANGER, message: "Unable to sign in with Facebook" })
        } else {
          this.props.setCurrentUser(user)
          this.setState({ redirect: true })
        }
      })
  }

  authWithEmailPassword(event) {
    event.preventDefault()

    const email = this.emailInput.value
    const password = this.passwordInput.value

    app.auth().fetchProvidersForEmail(email)
      .then((providers) => {
        if (providers.length === 0) {
          // create user
          return app.auth().createUserWithEmailAndPassword(email, password)
        } else if (providers.indexOf("password") === -1) {
          // they used facebook
          this.loginForm.reset()
          this.toaster.show({ intent: Intent.WARNING, message: "Try alternative login." })
        } else {
          // sign user in
          return app.auth().signInWithEmailAndPassword(email, password)
        }
      })
      .then((user) => {
        if (user && user.email) {
          this.loginForm.reset()
          this.props.setCurrentUser(user)
          this.setState({redirect: true})
        }
      })
      .catch((error) => {
        this.toaster.show({ intent: Intent.DANGER, message: error.message })
      })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }

    if (this.state.redirect === true) {
      return <Redirect to={from} />
    }


    return (
    <div className="splash-page">
      <div class="title">Critique Connect</div>
        <div className="login-styles">
          <Toaster ref={(element) => { this.toaster = element }} />
          <form className="email-auth" onSubmit={(event) => this.authWithEmailPassword(event)}
            ref={(form) => { this.loginForm = form }}>
            <div style={{marginBottom: "10px"}} className="pt-callout pt-icon-info-sign">
              If you've never logged in, this will create your account.
            </div>
            <label className="pt-label">
              Email
              <input style={{width: "100%"}} className="pt-input" name="email" type="email" ref={(input) => {this.emailInput = input}} placeholder="Email"></input>
            </label>
            <label className="pt-label">
              Password
              <input style={{width: "100%"}} className="pt-input" name="password" type="password" ref={(input) => {this.passwordInput = input}} placeholder="Password"></input>
            </label>
            <input style={{width: "100%"}} type="submit" className="pt-button pt-intent-primary" value="Log In"></input>
          </form>
          <center><span className="or-auth-separator">OR</span></center>
          <button style={{width: "100%"}} className="pt-button pt-intent-primary fb-auth" onClick={() => this.authWithFacebook()}>Log In with Facebook</button>
        </div>
      </div>
    )
  }
}

export default Login