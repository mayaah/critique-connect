import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import * as constants from './constants';
import { firebaseDB } from './base';

class HomePage extends Component {
  constructor() {
    super()
      this.state = {
      redirect: false,
      users: [],
      wips: [],
      threads: []
    }
    this.usersRef = firebaseDB.database().ref(`/Users`).orderByChild('lastActive').limitToLast(6)
    this.wipsRef = firebaseDB.database().ref(`/WIPs`).orderByChild('creationDate').limitToLast(4)
    this.threadsRef = firebaseDB.database().ref(`/Threads`).orderByChild('date').limitToLast(6)
  } 

  componentWillMount() {
    this.usersRef.on('value', snapshot => {
      let users = snapshot.val();
      let newState = [];
      let promises = [];
      for (let user in users) {
        var userRef = firebaseDB.database().ref(`/Users/${user}`)
        promises.push(userRef.once('value')); 
      }
      Promise.all(promises).then((snapshots) => {
        snapshots.forEach((snapshot) => {
          var user = snapshot.val()
          newState.push({
            id: snapshot.key,
            name: user.displayName,
            avatarURL: user.avatarURL ? user.avatarURL : constants.DEFAULT_AVATAR_URL
          }); 
        });
        this.setState({
          users: newState
        });
      });
    });

    this.wipsRef.on('value', snapshot => {
      let wips = snapshot.val();
      let newState = [];
      let promises = [];
      for (let wip in wips) {
        var wipRef = firebaseDB.database().ref(`/WIPs/${wip}`)
        promises.push(wipRef.once('value')); 
      }
      Promise.all(promises).then((snapshots) => {
        snapshots.forEach((snapshot) => {
          var wip = snapshot.val()
          newState.push({
            id: snapshot.key,
            title: wip.title,
            wc: wip.wc,
            genres: wip.genres,
            logline: wip.logline,
            types: wip.types,
          });
        });
        this.setState({
          wips: newState
        });
      });
    });

    this.threadsRef.on('value', snapshot => {
      let threads = snapshot.val();
      let newState = [];
      let promises = [];
      for (let thread in threads) {
        var threadRef = firebaseDB.database().ref(`/Threads/${thread}`)
        promises.push(threadRef.once('value')); 
      }
      Promise.all(promises).then((snapshots) => {
        snapshots.forEach((snapshot) => {
          var thread = snapshot.val()
          newState.push({
            id: snapshot.key,
            topic: thread.topic,
          });
        });
        this.setState({
          threads: newState
        });
      });
    });  
  }

  componentWillUnmount() {
    this.usersRef.off();
    this.wipsRef.off();
    this.threadsRef.off();
  }

  render() {
    return (
      <Grid style={{ marginTop: "75px" }}>
        <Row className="display-WIPs homepage-section display-flex">
          <Col sm={12} md={12} lg={12}>
            <div className="section-divider">
              <span className="section-divider-title">
                Newest Works in Progress
              </span>
              <div className="section-divider-hr"></div>
            </div>
          </Col>
        </Row>
        <Row className="row-display-flex">
          {this.state.wips.map((WIP) => {
            return (
              <Col sm={3} md={6} className="hompage-wip">
                <Link to={"/wip/" + WIP.id} key={WIP.id}>
                  <div className="homepage-wip-name">
                    {WIP.title}
                  </div>
                  {WIP.types[0] && (
                    <span className="homepage-wip-types-text">
                      {WIP.types.join(', ')} 
                    </span>
                  )}
                  {(WIP.types[0] && WIP.wc > 0) && (
                    <span>&nbsp;|&nbsp;</span>
                  )}
                  {WIP.wc > 0 && (
                    <span className="wip-wc-text">
                      {WIP.wc} words
                    </span>
                  )}
                  {WIP.genres.map((genre) => {
                    return (
                      <div className="wip-genre-text" key={genre}>
                        {constants.GENRES_HASH[genre]}
                      </div>
                    )
                  })}
                  <div className="wip-logline-text">
                    {WIP.logline}
                  </div>
                </Link>
              </Col>
            )
          })}
        </Row>
        <Row className="homepage-section">
          <Col xs={12} sm={6} md={6} lg={6}>
            <div className="section-divider">
              <span className="section-divider-title">
                Most Recently Active Users
              </span>
              <div className="section-divider-hr"></div>
            </div>
            {this.state.users.map((user) => {
              return (
                <Link to={"/user/" + user.id} key={user.id}>
                  <Col xs={6} sm={6} md={4} lg={4} className="homepage-user flex">
                    <div className="homepage-avatar-url-container">
                      <Image className="homepage-avatar-url" 
                             src={user.avatarURL} 
                             responsive
                      />
                    </div>
                    <div className="homepage-user-name">
                      {user.name}
                    </div>
                  </Col>
                </Link>
              )
            })}
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <div className="section-divider">
              <span className="section-divider-title">
                Newest Discussions
              </span>
              <div className="section-divider-hr"></div>
            </div>
            {this.state.threads.map((thread) => {
              return (
                <Link to={"/thread/" + thread.id} key={thread.id}>
                  <Col sm={12} className="homepage-thread">
                    <div className="thread-title">
                      {thread.topic}
                    </div>
                  </Col>
                </Link>
              )
            })}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default HomePage;

