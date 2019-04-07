import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Intent } from "@blueprintjs/core";
import { Grid, Row, Col, Image, Button } from 'react-bootstrap';
import * as constants from '../constants';
import { firebaseDB, facebookProvider, googleProvider, twitterProvider } from '../base'

class Login extends Component {
  constructor() {
    super()
    this.authWithFacebook = this.authWithFacebook.bind(this)
    this.authWithGoogle = this.authWithGoogle.bind(this)
    this.authWithTwitter = this.authWithTwitter.bind(this)
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
          console.log(user)
          console.log(firebaseDB.auth().currentUser)
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
      if (!userDB.displayName) {
        userRef.update({
          displayName: user.displayName.split(" ")[0]
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

  render() {
    const { from } = this.props.authenticated ? { from: { pathname: '/homepage'} } : { from: {pathname: '/'} }

    if (this.state.redirect === true) {
      return <Redirect to={from} />
    }

    return (
      <div>
        <div className="splash-page">
          {this.props.authenticated ? (
            null
          ) : (
            <Grid>
              <Row>
                <Col xs={12} sm={12} lg={12}>
                  <Image src={require('../images/landing.png')} responsive />
                </Col>
              </Row>
              <Row className="login-styles">
                <Col xs={4} sm={4} lg={4}>
                  <Button 
                    type='button'
                    className="black-bordered-button"
                    onClick={() => this.authWithGoogle()}
                  >
                    Continue with Google
                  </Button>
                </Col>
                <Col xs={4} sm={4} lg={4}>
                  <Button 
                    type='button'
                    className="black-bordered-button"
                    onClick={() => this.authWithFacebook()}
                  >
                    Continue with Facebook
                  </Button>
                </Col>
                <Col xs={4} sm={4} lg={4}>
                  <Button 
                    type='button'
                    className="black-bordered-button"
                    onClick={() => this.authWithTwitter()}
                  >
                    Continue with Twitter
                  </Button>
                </Col>
              </Row>
              <div className="splash-section-title">As a <span className="red">writer</span>...</div>
              <Row>
                <div className="vertical-align">
                  <Col xs={7} sm={7} lg={7}>
                    <Image className="splash-gif" src={require('../images/new_wip.gif')} responsive />
                  </Col>
                  <Col xs={5} sm={5} lg={5}>
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
                  <Col xs={5} sm={5} lg={5}>
                    <div>
                      <div className="section-divider">
                        <span className="section-divider-title">
                          Search for Beta Readers
                        </span>
                        <div className="section-divider-hr"></div>
                      </div>
                      <ul className="splash-bullets">
                        <li>Search for users who are looking to read</li>
                        <li>Filter search by genres</li>
                        <li>View potential beta reader's profiles</li>
                        <li>Weigh in attributes like critique style and compensation</li>
                        <li>Contact beta reader if it's a good fit!</li>
                        <li>Leave reviews for beta readers</li>
                      </ul>
                    </div>
                  </Col>
                  <Col xs={7} sm={7} lg={7}>
                    <Image className="splash-gif" src={require('../images/find_reader.gif')} responsive />
                  </Col>
                </div>
              </Row>
              <div className="splash-section-title">As a <span className="red">beta reader</span>...</div>
              <Row>
                <div className="vertical-align">
                  <Col xs={7} sm={7} lg={7}>
                    <Image className="splash-gif" src={require('../images/find_wip.gif')} responsive />
                  </Col>
                  <Col xs={5} sm={5} lg={5}>
                    <div>
                      <div className="section-divider">
                        <span className="section-divider-title">
                          Search Works in Progresses
                        </span>
                        <div className="section-divider-hr"></div>
                      </div>
                      With attributes like...
                      <ul className="splash-bullets">
                        <li>Genre(s)</li>
                        <li>Type(s)</li>
                        <li>Language</li>
                      </ul>
                      View more detailed WIP pages with
                      <ul className="splash-bullets">
                        <li>Word Count</li>
                        <li>Blurb</li>
                        <li>Discliamers</li>
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
