import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import NewWIPForm from './NewWIPForm';
import EditProfileForm from './EditProfileForm';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';


import { firebaseDB, base } from '../base'

class UserProfile extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirect: false,
      userId: this.props.match.params.id,
      currentUserId: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : "",
      displayName: "",
      lfr: false,
      ltr: false,
      bio: "",
      location: "",
      occupation: "",
      education: "",
      website: "",
      email: "",
      genresWrite: "",
      genresRead: "",
      WIPs: []
    }
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.userId}`)
    this.usersWIPsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/WIPs`)
    // this.WIPsRef = firebaseDB.database().ref(`/WIPs`).on('value', snapshot => {
    //   return snapshot.val();
    // })
  }

  componentWillMount() {
    this.removeWIP = this.removeWIP.bind(this)
  }


  componentDidMount() {
    this.userRef.on('value', snapshot => {
      let user = snapshot.val()
      this.setState({
        displayName: user.displayName,
        lfr: user.lfr ? user.lfr : false,
        ltr: user.ltr ? user.ltr : false,
        bio: user.bio ? user.bio : "",
        location: user.location ? user.location : "",
        occupation: user.occupation ? user.occupation : "",
        education: user.education ? user.education : "",
        website: user.website ? user.website : "",
        email: user.email ? user.email : "",
        avatarURL: user.avatarURL ? user.avatarURL : ""
      });
    });
    this.usersWIPsRef.on('value', snapshot => {
      let usersWIPs = snapshot.val();
      let newState = [];
      let promises = [];
      for (let userWIP in usersWIPs) {
        var WIPRef = firebaseDB.database().ref(`/WIPs/${userWIP}`)
        promises.push(WIPRef.once('value')); 
      }
      Promise.all(promises).then((snapshots) => {
        snapshots.forEach((snapshot) => {
          var WIP = snapshot.val()
          newState.push({
            id: snapshot.key,
            title: WIP.title
          });
        });
        this.setState({
          WIPs: newState
        });
      });
    });
  }

  componentWillUnmount() {
    this.userRef.off();
    this.usersWIPsRef.off();
    // this.WIPsRef.off()
  }

  removeWIP(WIPId) {
    const WIPRef = firebaseDB.database().ref(`/WIPs/${WIPId}`);
    WIPRef.remove();
    const usersWIPRef = firebaseDB.database().ref(`/Users/${this.state.userId}/WIPs/${WIPId}`)
    usersWIPRef.remove();
  }

  render() {

    const websiteTooltip = (
      <Tooltip id="tooltip">
        Website
      </Tooltip>
    );

    const emailTooltip = (
      <Tooltip id="tooltip">
        Email
      </Tooltip>
    );

    return (
        <Grid className="profile-page" style={{marginTop: "100px"}}>
          <Row className="profile-header">
            <Col sm={3} className="profile-avatar">
              <img src={this.state.avatarURL} responsive/>
            </Col>
            <Col sm={9} className="user-info-col">
              <div className="user-info">
                <h1 className="user-name">{this.state.displayName}</h1>
                <div className="user-info-details">
                  <Image className="user-info-icons" src={require('../images/location-gradient.png')} responsive/>
                  <span className="user-info-detail">{this.state.location}</span>
                </div>
                <div className="user-info-details">
                  <Image className="user-info-icons" src={require('../images/work-gradient.png')} responsive/>
                  <span className="user-info-detail">{this.state.occupation}</span>
                </div>
                <div className="user-info-details">
                  <Image className="user-info-icons" src={require('../images/education-gradient.png')} responsive/>
                  <span className="user-info-detail">{this.state.education}</span>
                </div>
                <div className="social-links">
                  <OverlayTrigger placement="left" overlay={websiteTooltip}>
                    <a href={this.state.website} target="_blank">
                      <Image className="social-icons" src={require('../images/website-gradient.png')} responsive/>
                    </a>
                  </OverlayTrigger>
                  <OverlayTrigger placement="left" overlay={emailTooltip}>
                    <a href={`mailto:${this.state.email}`} target="_top">
                      <Image className="social-icons" src={require('../images/email-gradient.png')} responsive/>
                    </a>
                  </OverlayTrigger>
                  <Image className="social-icons" src={require('../images/fb-icon.png')} responsive/>
                  <Image className="social-icons" src={require('../images/twitter-icon.png')} responsive/>
                </div>
                {this.state.userId == this.state.currentUserId
                  ?
                  (
                  <Link to={"/edit_profile"} >
                    <Button className="edit-profile-button" block>
                      <img src={require('../images/pencil-black.png')} responsive />
                      <span className="edit-profile-text">Edit Profile</span>
                    </Button>
                  </Link>
                  ) : (
                  <Button className="message-user-button" block>
                    <img src={require('../images/message-black.png')} responsive />
                    <span className="message-user-text">Send Message</span>
                  </Button>
                  )
                }
              </div>
            </Col>
          </Row>
            <div>
              <Link className="pt-button" aria-label="Log Out" to={"/submit_wip/"+this.state.userId} >Submit a Work in Progress</Link>
              <section className='display-WIPs'>
                  <div className="wrapper">
                    <ul>
                      {this.state.WIPs.map((WIP) => {
                        return (
                          <li key={WIP.id}>
                            <h3>{WIP.title}</h3>
                            <button className="pt-button" onClick={() => this.removeWIP(WIP.id)}>Remove Item</button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
              </section>
            </div>

        </Grid>
      );
  }
}

export default UserProfile;