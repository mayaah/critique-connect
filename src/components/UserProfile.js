import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import NewWIPForm from './NewWIPForm';
import EditProfileForm from './EditProfileForm';
import EditWIPForm from './EditWIPForm';
import WIP from './WIP.js';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';


import { firebaseDB, base } from '../base'

const genresHash = {
  adventure: "Adventure",
  cl: "Chick Lit",
  cmrf: "Contemporary, Mainstream, & Realistic",
  children: "Children's",
  erotic: "Erotic",
  fantasy: "Fantasy",
  historical: "Historical",
  hs: "Horror & Supernatural",
  lgbt: "LGBT+",
  literary: "Literary",
  ma: "Memoir & Autobiography",
  mg: "Middle Grade",
  mts: "Mystery, Thriller, & Suspense",
  na: "New Adult",
  nonfiction: "Other Nonfiction",
  rsna: "Religious, Spiritual, & New Age",
  romance: "Romance",
  shp: "Satire, Humor, & Parody",
  sf: "Science Fiction",
  wf: "Women's",
  ya: "Young Adult"
}

const typesHash = {
  fiction: "Fiction",
  nonfiction: "Nonfiction",
  novella: "Novella",
  poetry: "Poetry",
  ss: "Short Story",
  sp: "Screenplay",
  anthology: "Anthology"
}

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
      fbProfile: "",
      twitterProfile: "",
      genresWrite: [],
      genresRead: [],
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
      // let returnedGenresRead = []
      // let returnedGenresWrite = []
      // if (user.genresRead != null) {
      //   var genres = Object.keys(user.genresRead)
      //   var filteredRead = genres.filter(function(genre) {
      //     return user.genresRead[genre]
      //   })
      //   returnedGenresRead = filteredRead
      // }
      // if (user.genresWrite != null) {
      //   var genres = Object.keys(user.genresWrite)
      //   var filteredWrite = genres.filter(function(genre) {
      //     return user.genresWrite[genre]
      //   })
      //   returnedGenresWrite = filteredWrite
      // }
      this.setState({
        displayName: user.displayName,
        lfr: user.lfr ? user.lfr : false,
        ltr: user.ltr ? user.ltr : false,
        bio: user.bio ? user.bio : "",
        location: user.location ? user.location : "",
        occupation: user.occupation ? user.occupation : "",
        education: user.education ? user.education : "",
        website: user.website ? user.website : "",
        fbProfile: user.fbProfile ? user.fbProfile : "",
        twitterProfile: user.twitterProfile ? user.twitterProfile : "",
        email: user.email ? user.email : "",
        avatarURL: user.avatarURL ? user.avatarURL : "",
        genresRead: user.genresRead ? user.genresRead : [],
        genresWrite: user.genresWrite ? user.genresWrite : []
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
          // let returnedGenres = []
          // if (WIP.genres != null) {
          //   var genres = Object.keys(genresHash)
          //   var filteredGenres = genres.filter(function(genre) {
          //     return WIP.genres[genre]
          //   })
          //   returnedGenres = filteredGenres
          // }
          // let returnedTypes= []
          // if (WIP.types != null) {
          //   var types = Object.keys(typesHash)
          //   var filteredTypes = types.filter(function(type) {
          //     return WIP.types[type]
          //   })
          //   returnedTypes = filteredTypes
          // }
          newState.push({
            id: snapshot.key,
            title: WIP.title,
            wc: WIP.wc,
            genres: WIP.genres,
            logline: WIP.logline,
            types: WIP.types,
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

    const fbTooltip = (
      <Tooltip id="tooltip">
        Facebook Profile
      </Tooltip>
    );

    const twitterTooltip = (
      <Tooltip id="tooltip">
        Twitter Profile
      </Tooltip>
    );

    return (
        <Grid className="profile-page" style={{marginTop: "100px"}}>
          <Row className="profile-header">
            <Col sm={3} className="profile-avatar">
              <Row>
                <Col sm={12}>
                  <Image src={this.state.avatarURL} responsive/>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                   <div className="section-divider">
                    <span className="section-divider-title small-section-divider-title">
                      Genres I Read
                    </span>
                    <div className="section-divider-hr"></div>
                  </div>
                   <div className="display-genres-read">
                    <div className="wrapper">
                        {this.state.genresRead.map((genre) => {
                          return (
                            <div className="small-field-text">{genresHash[genre]}</div>
                          )
                        })}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                   <div className="section-divider">
                    <span className="section-divider-title small-section-divider-title">
                      Genres I Write
                    </span>
                    <div className="section-divider-hr"></div>
                  </div>
                   <div className="display-genres-write">
                    <div className="wrapper">
                        {this.state.genresWrite.map((genre) => {
                          return (
                            <div className="small-field-text">{genresHash[genre]}</div>
                          )
                        })}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col sm={9} className="user-info-col">
              <Row className="user-header">
                <Col sm={12}>
                  <div className="user-info">
                    <div className="user-name-and-labels">
                      <span className="user-name">{this.state.displayName}</span>
                      {this.state.lfr ? 
                       (<Label className="looking-labels" id="lfr-label">Is Looking for a Reader</Label>) :
                       ( null )
                      }
                      {this.state.ltr ? 
                        (<Label className="looking-labels" id="ltr-label">Is Looking to Read</Label>) :
                        ( null )
                      }
                    </div>
                    <div className="user-info-details">
                      <Image className="user-info-icons" src={require('../images/location-black.png')} responsive/>
                      <span className="user-info-detail">{this.state.location}</span>
                    </div>
                    <div className="user-info-details">
                      <Image className="user-info-icons" src={require('../images/work-black.png')} responsive/>
                      <span className="user-info-detail">{this.state.occupation}</span>
                    </div>
                    <div className="user-info-details">
                      <Image className="user-info-icons" src={require('../images/education-black.png')} responsive/>
                      <span className="user-info-detail">{this.state.education}</span>
                    </div>
                    <div className="social-links">
                      <OverlayTrigger placement="left" overlay={websiteTooltip}>
                        <a href={this.state.website} target="_blank">
                          <Image className="social-icons" src={require('../images/website-black.png')} responsive/>
                        </a>
                      </OverlayTrigger>
                      <OverlayTrigger placement="left" overlay={emailTooltip}>
                        <a href={`mailto:${this.state.email}`} target="_top">
                          <Image className="social-icons" src={require('../images/email-black.png')} responsive/>
                        </a>
                      </OverlayTrigger>
                      <OverlayTrigger placement="left" overlay={fbTooltip}>
                        <a href={this.state.fbProfile} target="_blank">
                          <Image className="social-icons" src={require('../images/fb-icon.png')} responsive/>
                        </a>
                      </OverlayTrigger>
                      <OverlayTrigger placement="left" overlay={twitterTooltip}>
                        <a href={this.state.twitterProfile} target="_blank">
                          <Image className="social-icons" src={require('../images/twitter-icon.png')} responsive/>
                        </a>
                      </OverlayTrigger>
                    </div>
                    {this.state.userId == this.state.currentUserId
                      ?
                      (
                      <Button className="black-bordered-button" block>
                        <Link className="flex" to={"/edit_profile"} >
                          <Image src={require('../images/pencil-black.png')} responsive />
                          <span className="edit-profile-text">Edit Profile</span>
                        </Link>
                      </Button>
                      ) : (
                      <Button className="black-bordered-button" block>
                        <Image src={require('../images/message-black.png')} responsive />
                        <span className="message-user-text">Send Message</span>
                      </Button>
                      )
                    }
                  </div>
                </Col>
              </Row>
              <Row className="about-me">
                <Col sm={12}>
                  <div className="section-divider">
                    <span className="section-divider-title">
                      About Me
                    </span>
                    <div className="section-divider-hr"></div>
                  </div>
                  <div className="section-long-text">{this.state.bio}</div>
                </Col>
              </Row>
              <Row className="user-wips">
                <Col sm={12}>
                  <div className="section-divider">
                    <span className="section-divider-title">
                      My Works In Progress
                    </span>
                    <div className="section-divider-hr"></div>
                  </div>
                  <Button className="black-bordered-button">
                    <Link className="flex" to={"/submit_wip/"+this.state.userId} >Add a Work in Progress</Link>
                  </Button>
                  <div className="display-WIPs">
                    <div className="wrapper">
                      <div>
                        {this.state.WIPs.map((WIP) => {
                          return (
                            <Link to={"/wip/" + WIP.id}>
                            <div className="wip-summary" key={WIP.id}>
                              <div className="wip-name-text">{WIP.title}</div>
                              <div className="wip-types-text">{WIP.types.map((type) => typesHash[type]).join(', ')} |&nbsp;</div><div className="wip-wc-text">{WIP.wc} words</div>
                              {WIP.genres.map((genre) => {
                                return (
                                  <div className="wip-genre-text">{genresHash[genre]}</div>
                                )
                              })}
                              <div className="wip-logline-text">{WIP.logline}</div>
                            </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      );
  }
}

export default UserProfile;