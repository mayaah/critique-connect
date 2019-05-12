import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { firebaseDB } from '../base';
import * as constants from '../constants';

class Settings extends Component {
	constructor() {
    super()
    this.state = {
      redirect: false,
      currentUserId: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : "",
      userEmailVerified: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.emailVerified : false,
      usesEmailLogin: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.providerData.map(provider => provider.providerId).includes('password') : false,
      passwordOne: '',
      passwordTwo: '',
      error: null,
      deleted: false
    }
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.currentUserId}`);
    this.sendEmailVerification = this.sendEmailVerification.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.cleanUpUserFromOtherData = this.cleanUpUserFromOtherData.bind(this);
    this.removeUsersWips = this.removeUsersWips.bind(this);
    this.removeUsersFromThreads = this.removeUsersFromThreads.bind(this);
    this.removeUsersFromPosts = this.removeUsersFromPosts.bind(this);
    this.removeUsersFromReviews = this.removeUsersFromReviews.bind(this);
    this.deleteUserIndexRecord = this.deleteUserIndexRecord.bind(this);
  }

  componentWillMount() {

  }

  componentDidUpdate(nextProps) {
    window.scrollTo(0,0);
  }

  componentWillUmount() {

  }

  sendEmailVerification() {
    firebaseDB.auth().currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
    })
  }

  resetPassword(event) {
    const { passwordOne } = this.state;
    firebaseDB.auth().currentUser.updatePassword(passwordOne)
      .then(() => {
        this.setState({
          passwordOne: '',
          passwordTwo: '',
          error: null
        });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();

  }

  handleChange(event) {
    this.setState({ 
      [event.target.name]: event.target.value
    });
  }

  removeUsersWips() {
    const usersWIPsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/WIPs`)
    usersWIPsRef.on('value', snapshot => {
      let usersWIPs = snapshot.val();
      for (let userWIP in usersWIPs) {
        var WIPRef = firebaseDB.database().ref(`/WIPs/${userWIP}`)
        WIPRef.remove();
        WIPRef.on('value', snapshot => {
          // Get Algolia's objectID from the Firebase object key
          const objectID = snapshot.key;
          // Remove the object from Algolia
          constants.wipsIndex
          .deleteObject(objectID)
          .then(() => {
            console.log('Firebase object deleted from Algolia', objectID);
          })
          .catch(error => {
            console.error('Error when deleting contact from Algolia', error);
          });
        })
      }
    });
  }

  // Re-assign threads to deleted user
  removeUsersFromThreads() {
    const usersThreadsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/Threads`)
    usersThreadsRef.on('value', snapshot => {
      let usersThreads = snapshot.val();
      for (let usersThread in usersThreads) {
        var threadRef = firebaseDB.database().ref(`/Threads/${usersThread}`)
        threadRef.update({
          author: "[deleted]"
        })
      }
    })
  }

  // Re-assign posts to deleted user
  removeUsersFromPosts() {
    const usersPostsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/Posts`)
    usersPostsRef.on('value', snapshot => {
      let usersPosts = snapshot.val();
      for (let usersPost in usersPosts) {
        var postRef = firebaseDB.database().ref(`/Posts/${usersPost}`)
        postRef.update({
          author: "[deleted]"
        })
      }
    })
  }

  removeUsersFromReviews() {
    const usersReviewsGivenRef = firebaseDB.database().ref(`/Users/${this.state.userId}/ReviewsGiven`)
    usersReviewsGivenRef.on('value', snapshot => {
      let reviewsGiven = snapshot.val();
      for (let review in reviewsGiven) {
        var reviewRef = firebaseDB.database().ref(`/Reviews/${review}`)
        reviewRef.update({
          reviewerId: "[deleted]"
        })
      }
    })
  }

  deleteAccount() {
    this.cleanUpUserFromOtherData().then(() => {
      this.userRef.off();
      var userRef = firebaseDB.database().ref(`/Users/${this.state.userId}`)
      this.setState({ deleted: true },
        () => {
          userRef.remove();
          firebaseDB.auth().currentUser.delete();
        }
      )
    })
  }

  cleanUpUserFromOtherData() {
    return Promise.all([
      this.removeUsersWips(), 
      this.removeUsersFromThreads(),
      this.removeUsersFromPosts(),
      this.removeUsersFromReviews(),
      this.deleteUserIndexRecord(this.state.userId),
    ])
  }

  deleteUserIndexRecord(userId) {
    const userRef = firebaseDB.database().ref(`Users/${userId}`);
    userRef.on('value', snapshot => {
      // Get Algolia's objectID from the Firebase object key
      const objectID = snapshot.key;
      // Remove the object from Algolia
      constants.usersIndex
        .deleteObject(objectID)
        .then(() => {
          console.log('Firebase object deleted from Algolia', objectID);
        })
        .catch(error => {
          console.error('Error when deleting contact from Algolia', error);
        });
    })
  }
 

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    if (this.state.deleted === true) {
      return <Redirect to= {{pathname: '/logout'}} />
    }

	  return (
      <Grid style={{marginTop: "100px", marginBottom: "50px"}}>
      	<div className="splash-section-title">Settings</div>
        <Row>
          <Col sm={3}></Col>
          <Col sm={6}>
            <div className="section-divider">
              <span className="section-divider-title">
                Email Verification
              </span>
              <div className="section-divider-hr"></div>
            </div>
            {this.state.userEmailVerified ? (
                <div>Your email is verified!</div>
            ) : (
              <div>
              <p>Your email is not verified.</p>

              <p>Check your email (spam folder included) for a confirmation email or
              send another confirmation email.</p>

              <Button className="black-bordered-button" onClick={() => this.sendEmailVerification()}>
                Send Confirmation Email
              </Button>

              </div>
            )}
            
            {this.state.usesEmailLogin && (
              <div>
                <div className="section-divider">
                  <span className="section-divider-title">
                    Password Reset
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <form onSubmit={this.resetPassword}>
                  <input
                    className="pt-input input-field" 
                    name="passwordOne"
                    id="passwordInput"
                    value={passwordOne}
                    onChange={this.handleChange}
                    type="password"
                    placeholder="New Password"
                  />
                  <input
                    className="pt-input input-field"
                    id="passwordInput"
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.handleChange}
                    type="password"
                    placeholder="Confirm New Password"
                  />
                  <button 
                    disabled={isInvalid} 
                    type="submit"
                    className="black-bordered-button" 
                  >
                    Reset My Password
                  </button>

                  {error && <p className="red">{error.message}</p>}
                </form>
              </div>
            )}
            <Button
              style={{ marginTop: "100px" }}
              className="black-bordered-button red" 
              onClick={() => { if (window.confirm('Are you sure you wish to delete your account?')) this.deleteAccount() }}
            >
              Delete Account
            </Button>
          </Col>
          <Col sm={3}></Col>
        </Row>
      </Grid>
	  );
  }
}

export default Settings;
