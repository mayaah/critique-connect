import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Toaster, Intent } from "@blueprintjs/core";
import { Grid, Row, Col, Image, Button } from 'react-bootstrap';
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
      displayName: user.displayName.split(" ")[0]
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
          <Grid>
            <Row>
              <Col xs={12} sm={12} lg={12}>
                <div className="cc-title">
                  Critique&nbsp;&nbsp;
                    <Image src={require('../images/sharpener-gradient.png')} responsive/>
                  &nbsp;&nbsp;Connect
                </div>
              </Col>
            </Row>
            <Row className="login-styles">
              <Col xs={4} sm={4} lg={4}>
                <Button className="login-auth g-auth" onClick={() => this.authWithGoogle()} block>
                  <Image src={require('../images/google-icon.png')} responsive />
                  <span className="login-button-text">Continue with Google</span>
                </Button>
              </Col>
              <Col xs={4} sm={4} lg={4}>
                <Button className="login-auth fb-auth" onClick={() => this.authWithFacebook()} block>
                  <Image src={require('../images/fb-icon.png')} responsive />
                  <span className="login-button-text">Continue with Facebook</span>
                </Button>
              </Col>
              <Col xs={4} sm={4} lg={4}>
                <Button className="login-auth t-auth" onClick={() => this.authWithTwitter()} block>
                  <Image src={require('../images/twitter-icon.png')} responsive />
                  <span className="login-button-text">Continue with Twitter</span>
                </Button>
              </Col>
            </Row>
          </Grid>
          )
        }
      </div>
    </div>
    )
  }
}

export default Login