import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import WIP from './WIP.js';
import NewReviewForm from './NewReviewForm'
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';
import { Spinner } from '@blueprintjs/core';
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

const TRAITS_LIST = [
  "Constructive", 
  "Detailed", 
  "Encouraging", 
  "Honest", 
  "Insightful", 
  "Kind", 
  "Respectful", 
  "Thorough", 
  "Timely"]


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
      WIPs: [],
      reviews: [],
      traits: {},
      joinDate: "",
      lastActive: "",
      critiqueTolerance: "",
      critiqueStyle: "",
      goals: "",
      compensation: "",
      rates: "",
      reviewsToShow: 5,
      doneExpanded: false,
      loading: true,
    }
    this.handleChange = this.handleChange.bind(this);
    this.showMore = this.showMore.bind(this);
    this.simplifyDate = this.simplifyDate.bind(this);
    this.loadData = this.loadData.bind(this);
    this.thereIsSomeUserInfo = this.thereIsSomeUserInfo.bind(this);
  }

  componentWillMount() {
    this.removeWIP = this.removeWIP.bind(this)
    this.loadData(this.state.userId);
  }

  componentDidUpdate(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.setState({ userId: this.props.match.params.id });
      this.loadData(this.props.match.params.id);
    }
    window.scrollTo(0,0);
  }

  componentWillUnmount() {
    this.userRef.off();
    this.usersWIPsRef.off();
    this.usersReviewsRef.off();
  }

  loadData(userId) {
    this.userRef = firebaseDB.database().ref(`/Users/${userId}`)
    this.usersWIPsRef = firebaseDB.database().ref(`/Users/${userId}/WIPs`)
    this.usersReviewsRef = firebaseDB.database().ref(`/Users/${userId}/Reviews`)
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
        fbProfile: user.fbProfile ? user.fbProfile : "",
        twitterProfile: user.twitterProfile ? user.twitterProfile : "",
        email: user.email ? user.email : "",
        avatarURL: user.avatarURL ? user.avatarURL : "https://firebasestorage.googleapis.com/v0/b/critique-connect.appspot.com/o/images%2Fwatercolour-2038253.jpg?alt=media&token=4a02554a-ca37-4b95-a7e4-a62bfdc1db6c",
        genresRead: user.genresRead ? user.genresRead : [],
        genresWrite: user.genresWrite ? user.genresWrite : [],
        traits: user.Traits ? user.Traits : {},
        joinDate: user.creationDate ? user.creationDate : "",
        lastActive: user.lastLogin ? user.lastLogin : "",
        critiqueTolerance: user.critiqueTolerance ? user.critiqueTolerance : "",
        critiqueStyle: user.critiqueStyle ? user.critiqueStyle : "",
        goals: user.goals ? user.goals : "",
        compensation: user.compensation ? user.compensation : "",
        rates: user.rates ? user.rates : "",
        loading: false,
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
    this.usersReviewsRef.on('value', snapshot => {
      let usersReviews = snapshot.val();
      let newState = [];
      let promises = [];
      for (let userReview in usersReviews) {
        var reviewRef = firebaseDB.database().ref(`/Reviews/${userReview}`)
        promises.push(reviewRef.once('value')); 
      }
      Promise.all(promises).then((snapshots) => {
        snapshots.forEach((snapshot) => {
          var review = snapshot.val()
          let reviewerName = ""
          let reviewerAvatar = ""
          var reviewerRef = firebaseDB.database().ref(`/Users/${review.reviewerId}`)
          reviewerRef.once('value', snapshot2 => {
            let reviewer = snapshot2.val();
            reviewerName = reviewer.displayName,
            reviewerAvatar = reviewer.avatarURL
            newState.push({
              id: snapshot.key,
              reviewMessage: review.reviewMessage,
              reviewerId: review.reviewerId,
              reviewDate: review.reviewDate,
              reviewerAvatar: reviewerAvatar,
              reviewerName: reviewerName,
              traits: review.traits || []
            });
            var sortedArr = newState.sort(function(a, b){
              var keyA = new Date(a.reviewDate),
                  keyB = new Date(b.reviewDate);
              // Compare the 2 dates
              if(keyA < keyB) return 1;
              if(keyA > keyB) return -1;
              return 0;
            });
            console.log(sortedArr)
            this.setState({
              reviews: sortedArr,
            });
          })
        });
      });
    });
  }

  removeWIP(WIPId) {
    const WIPRef = firebaseDB.database().ref(`/WIPs/${WIPId}`);
    WIPRef.remove();
    const usersWIPRef = firebaseDB.database().ref(`/Users/${this.state.userId}/WIPs/${WIPId}`)
    usersWIPRef.remove();
  }

  handleChange(event) {
    this.setState({ 
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  }

  showMore() {
    this.state.reviewsToShow === 5 ? (
      this.setState({ 
        reviewsToShow: this.state.reviews.length, 
        expanded: true  
      })
    ) : (
      this.setState({ 
        reviewsToShow: 5, 
        expanded: false 
      })
    )
  }

  simplifyDate(date) {
    let dateArray = date.split(" ")
    let dateOnly = dateArray.slice(1, 4)
    return dateOnly.join(" ")
  }

  // Used to check if there exists some user info to know whether to show the user info div
  thereIsSomeUserInfo() {
    return this.state.location.length > 0 || this.state.occupation.length > 0 || this.state.education.length > 0
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

    const locationTooltip = (
      <Tooltip id="tooltip">
        Location
      </Tooltip>
    );

    const occupationTooltip = (
      <Tooltip id="tooltip">
        Occupation
      </Tooltip>
    );

    const educationTooltip = (
      <Tooltip id="tooltip">
        Education
      </Tooltip>
    );

    return (
      <Grid className="profile-page" style={{ marginTop: "100px" }}>
        <Row className="profile-header">
          <Col sm={3}>
            <Row>
              <Col sm={12}>
                <div className="profile-avatar-container">
                  <Image className="profile-avatar" 
                         src={this.state.avatarURL} 
                         responsive
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                {this.state.genresRead.length > 0 && (
                  <div className="user-profile-section">
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
                              <div className="small-field-text">
                                {genresHash[genre]}
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                {this.state.genresWrite.length > 0 && (
                  <div className="user-profile-section">
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
                              <div className="small-field-text">
                                {genresHash[genre]}
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            {this.state.ltr ? (
              <Row>
                <Col sm={12}>
                  {this.state.compensation.length > 0 && (
                    <div className="user-profile-section">
                      <div className="section-divider">
                        <span className="section-divider-title small-section-divider-title">
                          Critique Compensation
                        </span>
                        <div className="section-divider-hr"></div>
                      </div>
                       <div className="display-genres-write">
                        <div className="wrapper">
                          <div className="small-field-text">
                            {this.state.compensation}
                          </div>
                          {this.state.compensation == "Paid Services" ? (
                            <div className="small-field-text">
                              {this.state.rates}
                            </div>
                          ) : (
                            null
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            ) : (
              null
            )}
            {this.state.ltr ? (
              <Row>
                <Col sm={12}>
                  {this.state.critiqueStyle.length > 0 && (
                    <div className="user-profile-section">
                      <div className="section-divider">
                        <span className="section-divider-title small-section-divider-title">
                          Critique Style
                        </span>
                        <div className="section-divider-hr"></div>
                      </div>
                       <div className="display-genres-write">
                        <div className="wrapper">
                          <div className="small-field-text">
                            {this.state.critiqueStyle}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Col>
              </Row> 
            ) : (
              null
            )}
            {this.state.lfr ? (
              <Row>
                <Col sm={12}>
                  {this.state.critiqueTolerance.length > 0 && (
                    <div className="user-profile-section">
                      <div className="section-divider">
                        <span className="section-divider-title small-section-divider-title">
                          Critique Tolerance
                        </span>
                        <div className="section-divider-hr"></div>
                      </div>
                       <div className="display-genres-write">
                        <div className="wrapper">
                          <div className="small-field-text">
                            {this.state.critiqueTolerance}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Col>
              </Row> 
            ) : (
              null
            )}
            <Row>
              <Col sm={12}>
                {this.state.goals.length > 0 && (
                  <div className="user-profile-section">
                    <div className="section-divider">
                      <span className="section-divider-title small-section-divider-title">
                        Goals
                      </span>
                      <div className="section-divider-hr"></div>
                    </div>
                     <div className="display-genres-write">
                      <div className="wrapper">
                        <div className="small-field-text">
                          {this.state.goals}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Col>
            </Row> 
          </Col>
          <Col sm={9} className="user-info-col">
            <Row className="user-header">
              <Col sm={12}>
                <div className="user-info">
                  <div className="user-name-and-labels">
                    <span className="user-name">
                      {this.state.displayName}
                    </span>
                    {this.state.lfr ? (
                      <Label className="looking-labels" id="lfr-label">
                        Is Looking for a Reader
                      </Label>
                    ) : ( 
                      null
                    )}
                    {this.state.ltr ? (
                      <Label className="looking-labels" id="ltr-label">
                        Is Looking to Read
                      </Label>
                    ) : ( 
                      null
                    )}
                  </div>
                  <Row>
                    {this.thereIsSomeUserInfo() && (
                      <Col sm={4}>
                        {this.state.location.length > 0 && (
                          <div className="user-info-details">
                            <OverlayTrigger placement="left" overlay={locationTooltip}>
                              <Image className="user-info-icons" 
                                     src={require('../images/location-black.png')} 
                                     responsive
                              />
                            </OverlayTrigger>
                            <span className="user-info-detail">
                              {this.state.location}
                            </span>
                          </div>
                        )}
                        {this.state.occupation.length > 0 && (
                          <div className="user-info-details">
                            <OverlayTrigger placement="left" overlay={occupationTooltip}>
                              <Image className="user-info-icons" 
                                     src={require('../images/work-black.png')} 
                                     responsive/>
                            </OverlayTrigger>
                            <span className="user-info-detail">
                              {this.state.occupation}
                            </span>
                          </div>
                        )}
                        {this.state.education.length > 0 && (
                          <div className="user-info-details">
                            <OverlayTrigger placement="left" overlay={educationTooltip}>
                              <Image className="user-info-icons" 
                                     src={require('../images/education-black.png')} 
                                     responsive
                              />
                            </OverlayTrigger>
                            <span className="user-info-detail">
                              {this.state.education}
                            </span>
                          </div>
                        )}
                      </Col>
                    )}
                    <Col sm={4}>
                      <div className="user-info-details">
                        <span className="user-info-detail-label">
                          Joined: 
                        </span>
                        <span className="user-info-detail">
                          {this.state.joinDate}
                        </span>
                      </div>
                      <div className="user-info-details">
                        <span className="user-info-detail-label">
                          Last Active: 
                        </span>
                        <span className="user-info-detail">
                          {this.state.lastActive}
                        </span>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="social-links">
                        {this.state.website.length > 0 && (
                          <OverlayTrigger placement="left" overlay={websiteTooltip}>
                            <a href={this.state.website} target="_blank">
                              <Image className="social-icons" 
                                     src={require('../images/website-black.png')} 
                                     responsive
                              />
                            </a>
                          </OverlayTrigger>
                        )}
                        {this.state.email.length > 0 && (
                          <OverlayTrigger placement="left" overlay={emailTooltip}>
                            <a href={`mailto:${this.state.email}`} target="_top">
                              <Image className="social-icons" 
                                     src={require('../images/email-black.png')} 
                                     responsive
                              />
                            </a>
                          </OverlayTrigger>
                        )}
                        {this.state.fbProfile.length > 0 && (
                          <OverlayTrigger placement="left" overlay={fbTooltip}>
                            <a href={this.state.fbProfile} target="_blank">
                              <Image className="social-icons" 
                                     src={require('../images/fb-icon.png')} 
                                     responsive/>
                            </a>
                          </OverlayTrigger>
                        )}
                        {this.state.twitterProfile.length > 0 && (
                          <OverlayTrigger placement="left" overlay={twitterTooltip}>
                            <a href={this.state.twitterProfile} target="_blank">
                              <Image className="social-icons" 
                                     src={require('../images/twitter-icon.png')} 
                                     responsive/>
                            </a>
                          </OverlayTrigger>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <div className="user-traits">
                    {TRAITS_LIST.map((trait) => {
                      return (
                        <span className="user-trait-count">
                          {trait} (+{this.state.traits[trait] ? this.state.traits[trait] : 0})
                        </span>
                      )
                    })}
                  </div>
                  {this.state.userId == this.state.currentUserId ? (
                    <Button className="black-bordered-button">
                      <Link className="flex" to={"/edit_profile"} >
                        Edit Profile
                      </Link>
                    </Button>
                  ) : (
                    null
                  )}
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
                {this.state.bio.length > 0 ? (
                  <div className="section-long-text">{this.state.bio}</div>
                ) : (
                  <div className="no-data">
                    I haven't filled this out yet!
                  </div>
                )}
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
                {this.state.userId == this.state.currentUserId ? (
                  <Button className="black-bordered-button">
                    <Link className="flex" to={"/submit_wip/"+this.state.userId}>
                      Add a Work in Progress
                    </Link>
                  </Button>
                ) : (
                  null
                )}
                {this.state.WIPs.length > 0 ? (
                  <div className="display-WIPs">
                    {this.state.WIPs.map((WIP) => {
                      return (
                        <Link to={"/wip/" + WIP.id}>
                          <div className="wip-summary" key={WIP.id}>
                            <div className="wip-name-text">
                              {WIP.title}
                            </div>
                            {WIP.types[0].length > 0 && (
                              <div className="wip-types-text">
                                {WIP.types.join(', ')} |&nbsp;
                              </div>
                            )}
                            {WIP.wc > 0 && (
                              <div className="wip-wc-text">
                                {WIP.wc} words
                              </div>
                            )}
                            {WIP.genres.map((genre) => {
                              return (
                                <div className="wip-genre-text">
                                  {genresHash[genre]}
                                </div>
                              )
                            })}
                            <div className="wip-logline-text">
                              {WIP.logline}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) :  (
                  <div className="no-data">
                    I have no WIPs.
                  </div>
                )}
              </Col>
            </Row>
            <Row className="user-reviews">
              <Col sm={12}>
                <div className="section-divider">
                  <span className="section-divider-title">
                    Reviews
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <NewReviewForm revieweeId={this.state.userId} 
                               revieweeName={this.state.displayName} />
                <div className="display-WIPs">
                  {this.state.reviews.slice(0, this.state.reviewsToShow).map((review) => {
                    return (
                      <div className="review-summary" key={review.id}>
                        <div className="review-message">
                          "{review.reviewMessage}"
                        </div>
                        {review.traits.map((trait) => {
                          return (
                            <span className="review-trait">
                              {trait}(+1)
                            </span>
                            )
                        })}
                        <div className="review-metadata"> 
                          <Link to={"/user/" + review.reviewerId}>
                            <div className="reviewer-info flex">
                              <div className="reviewer-avatar-container">
                                <Image className="reviewer-avatar" 
                                       src={review.reviewerAvatar} 
                                       responsive 
                                />
                              </div>
                              <div className="reviewer-name">
                                {review.reviewerName}
                              </div>
                            </div>
                          </Link>
                          <div className="review-date">
                            {this.simplifyDate(new Date(review.reviewDate).toUTCString())}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {this.state.reviews.length > 5 && (
                  <Button className="black-bordered-button" onClick={this.showMore}>
                    {this.state.expanded ? (
                      <span>Show less</span>
                    ) : (
                      <span>Show more</span>
                    )}
                  </Button>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default UserProfile;
