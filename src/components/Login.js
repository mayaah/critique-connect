import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Toaster, Intent } from "@blueprintjs/core";
import { Grid, Row, Col, Image, Button } from 'react-bootstrap';
import * as constants from '../constants';
import { firebaseDB, facebookProvider, googleProvider, twitterProvider } from '../base'

class Login extends Component {
  constructor() {
    super()
    this.authWithFacebook = this.authWithFacebook.bind(this)
    this.authWithGoogle = this.authWithGoogle.bind(this)
    this.authWithTwitter = this.authWithTwitter.bind(this)
    this.sendEmailVerification = this.sendEmailVerification.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.state = {
      redirect: false,
      showForgotPasswordForm: false,
      passwordResetError: null,
      email: ''
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
      .catch((error) => {
        alert(error.message)
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
          this.createNewUser()
        }
      })
      .catch((error) => {
        alert(error.message)
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
      .catch((error) => {
        alert(error.message)
      })
  }

  authWithEmailPassword(event) {
    event.preventDefault()

    const email = this.emailInput.value
    const password = this.passwordInput.value

    var newUser = false
    firebaseDB.auth().fetchProvidersForEmail(email)
      .then((providers) => {
        if (providers.length === 0) {
          // create user
          newUser = true
          return firebaseDB.auth().createUserWithEmailAndPassword(email, password)
        } else if (providers.indexOf("password") === -1) {
          this.loginForm.reset()
          this.toaster.show({ intent: Intent.WARNING, message: "Try alternative login." })
        } else {
          // sign in with email/password
          return firebaseDB.auth().signInWithEmailAndPassword(email, password)
        }
      })
      .catch((error) => {
        this.toaster.show({ intent: Intent.DANGER, message: error.message })
      })
      .then((user) => {
        if (user && user.email) {
          this.loginForm.reset()
          this.props.setCurrentUser(user)
          this.setState({ redirect: true })
        }
      })
      .then(() => {
        this.createNewUser()
        if (newUser) {
          this.sendEmailVerification()
        }
      })
      .catch((error) => {
        this.toaster.show({ intent: Intent.DANGER, message: error.message })
      })
  }

  sendEmailVerification() {
    firebaseDB.auth().currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
    })
  }

  resetPassword(event) {
    firebaseDB.auth().sendPasswordResetEmail(this.state.email)
      .then(() => {
        this.setState({
          email: '',
          passwordResetError: null,
          showForgotPasswordForm: false
        });
      })
      .catch(error => {
        this.setState({ passwordResetError: error });
      });

    event.preventDefault();
  }

  createNewUser() {
    var user = firebaseDB.auth().currentUser;
    var userRef = firebaseDB.database().ref(`Users/${user.uid}`)
    userRef.update({
      creationDate: this.simplifyDate(user.metadata.creationTime),
      lastLogin: this.simplifyDate(user.metadata.lastSignInTime),
      lastLoginUnix: new Date(user.metadata.lastSignInTime).getTime()
    });
    // If we haven't already saved a displayName
    userRef.once('value', snapshot => {
      let userDB = snapshot.val();
      if (!userDB.displayName && user.displayName !==  null) {
        userRef.update({
          displayName: user.displayName.split(" ")[0]
        })
      }
      if (user.displayName === null) {
        userRef.update({
          displayName: "Anonymous"
        })
      }
    })
    this.addOrUpdateIndexRecord(user.uid)
  }

  addOrUpdateIndexRecord(userId) {
    const userRef = firebaseDB.database().ref(`Users/${userId}`);
    userRef.on('value', snapshot => {
      // Get Firebase object
      const record = snapshot.val();
      // Specify Algolia's objectID using the Firebase object key
      // Add or update object
      const recordToSend = {
        objectID: snapshot.key,
        avatarURL: record.avatarURL,
        ltr: record.ltr,
        lfr: record.lfr,
        displayName: record.displayName,
        lastLogin: record.lastLogin,
        lastActive: record.lastActive,
        compensation: record.compensation,
        genresWrite: record.genresWrite,
        genresRead: record.genresRead
      }
      constants.usersIndex
        .saveObject(recordToSend)
        .then(() => {
          console.log('Firebase object indexed in Algolia', record.objectID);
        })
        .catch(error => {
          console.error('Error when indexing contact into Algolia', error);
          process.exit(1);
        });
    })
  }

  // Expects Firebase formated date such as: "Sun, 21 Jan 2018 23:19:31 GMT"
  // Returns "21 Jan 2018"
  simplifyDate(date) {
    let dateArray = date.split(" ")
    let dateOnly = dateArray.slice(1, 4)
    return dateOnly.join(" ")
  }

  handleChange(event) {
    this.setState({ 
      [event.target.name]: event.target.value
    });
  }

  render() {
    const { from } = this.props.authenticated ? { from: { pathname: '/homepage'} } : { from: {pathname: '/'} }

    if (this.state.redirect === true) {
      return <Redirect to={from} />
    }

    const isInvalid = this.state.email === '';

    return (
      <div>
        <div className="splash-page">
          {this.props.authenticated ? (
            null
          ) : (
            <Grid style={{ marginTop: "100px" }}>
              <Row>
                <Col xs={12} sm={6} lg={6}>
                  <Image src={require('../images/landing.png')} responsive />
                </Col>
                <Col xs={12} sm={6} lg={6}>
                  <Toaster ref={(element) => { this.toaster = element }} />
                  {this.state.showForgotPasswordForm ? (
                    <form className="reset-password" onSubmit={this.resetPassword}>
                    <label className="pt-label form-field-box">
                      <input
                        className="pt-input input-field"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        type="text"
                        placeholder="Email Address"
                      />
                    </label>
                    <button 
                      disabled={isInvalid}
                      type="submit"
                      className="black-bordered-button"
                    >
                      Reset My Password
                    </button>
                    <p style={{ textAlign: "center"}}>A password reset link will be sent to your email.</p>

                    {this.state.passwordResetError && <p className="red">{this.state.passwordResetError.message}</p>}
                  </form>
                  ) : (
                    <form 
                    className="email-auth"
                    onSubmit={(event) => this.authWithEmailPassword(event)}
                    ref={(form) => { this.loginForm = form }}
                  >
                    <div style={{marginBottom: "10px"}} className="pt-callout pt-icon-info-sign">
                      If you've never logged in, this will create your account.
                    </div>
                    <label className="pt-label form-field-box">
                      <input 
                        className="pt-input input-field" 
                        name="email" 
                        type="email" 
                        ref={(input) => {this.emailInput = input}} placeholder="Email"
                      >
                      </input>
                    </label>
                    <label className="pt-label form-field-box">
                      <input 
                        className="pt-input input-field" 
                        name="password" 
                        type="password" 
                        ref={(input) => {this.passwordInput = input}} 
                        placeholder="Password"
                      >
                      </input>
                    </label>
                    <button 
                      type="submit"
                      className="black-bordered-button" 
                    >
                      Sign Up/Log In
                    </button>
                    <Link 
                      style={{ textAlign: "center", display: "block" }}
                      onClick={() => this.setState({showForgotPasswordForm: true})}
                    >
                      Forgot Password?
                    </Link>
                  </form>
                  )}
                  <div className="login-styles">
                    <Button 
                      type='button'
                      className="black-bordered-button"
                      onClick={() => this.authWithGoogle()}
                    >
                      Continue with Google
                    </Button>
                    <Button 
                      type='button'
                      className="black-bordered-button"
                      onClick={() => this.authWithFacebook()}
                    >
                      Continue with Facebook
                    </Button>
                    <Button 
                      type='button'
                      className="black-bordered-button"
                      onClick={() => this.authWithTwitter()}
                    >
                      Continue with Twitter
                    </Button>
                  </div>
                </Col>
              </Row>
              <div className="splash-section-title">As a <span className="red">writer</span>...</div>
              <Row>
                <div className="vertical-align">
                  <Col xs={12} sm={7} lg={7}>
                    <Image className="splash-gif" src={require('../images/new_wip_v2.gif')} responsive />
                  </Col>
                  <Col xs={12} sm={5} lg={5}>
                    <div>
                      <div className="section-divider">
                        <span className="section-divider-title">
                          Add a Work in Progress
                        </span>
                        <div className="section-divider-hr"></div>
                      </div>
                      With attributes like...
                      <ul className="splash-bullets">
                        <li>Word Count</li>
                        <li>Genre(s)</li>
                        <li>Blurb</li>
                        <li>Improvement Areas</li>
                        <li>And more...</li>
                      </ul>
                    </div>
                  </Col>
                </div>
              </Row>
              <Row>
                <div className="vertical-align">
                  <Col xs={12} sm={5} lg={5}>
                    <div>
                      <div className="section-divider">
                        <span className="section-divider-title">
                          Find Beta Readers
                        </span>
                        <div className="section-divider-hr"></div>
                      </div>
                      <ul className="splash-bullets">
                        <li>Search for users who are looking to read</li>
                        <li>Filter search by genres</li>
                        <li>View potential beta reader's profiles</li>
                        <li>Weigh in attributes like critique style, compensation, and reviews</li>
                        <li>Contact beta reader if it's a good fit!</li>
                        <li>Leave reviews for beta readers</li>
                      </ul>
                    </div>
                  </Col>
                  <Col xs={12} sm={7} lg={7}>
                    <Image className="splash-gif" src={require('../images/find_reader_v2.gif')} responsive />
                  </Col>
                </div>
              </Row>
              <div className="splash-section-title">As a <span className="red">beta reader</span>...</div>
              <Row>
                <div className="vertical-align">
                  <Col xs={12} sm={7} lg={7}>
                    <Image className="splash-gif" src={require('../images/find_wip_v2.gif')} responsive />
                  </Col>
                  <Col xs={12} sm={5} lg={5}>
                    <div>
                      <div className="section-divider">
                        <span className="section-divider-title">
                          Find Works in Progress
                        </span>
                        <div className="section-divider-hr"></div>
                      </div>
                      With attributes like...
                      <ul className="splash-bullets">
                        <li>Genre(s)</li>
                        <li>Type(s)</li>
                        <li>Language</li>
                      </ul>
                      View more detailed WIP pages with...
                      <ul className="splash-bullets">
                        <li>Word Count</li>
                        <li>Blurb</li>
                        <li>Disclaimers</li>
                      </ul>
                      If you're interested in beta reading the book, contact the author!
                    </div>
                  </Col>
                </div>
              </Row>
            </Grid>
          )}
        </div>
      </div>
    )
  }
}

export default Login;
