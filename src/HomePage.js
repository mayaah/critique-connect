import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Logout from './components/Logout';
import './HomePage.css';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';
import {InstantSearch, Hits, Highlight,SearchBox, RefinementList, ClearRefinements, CurrentRefinements, ToggleRefinement} from 'react-instantsearch/dom';

import { firebaseDB, base } from './base'

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


class HomePage extends Component {
  constructor() {
    super()
      this.state = {
      redirect: false,
      users: [],
      wips: [],
      threads: []
    }

    this.usersRef = firebaseDB.database().ref(`/Users`).orderByChild('creationDate').limitToLast(6)
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
            avatarURL: user.avatarURL ? user.avatarURL : "https://firebasestorage.googleapis.com/v0/b/critique-connect.appspot.com/o/images%2Fwatercolour-2038253.jpg?alt=media&token=4a02554a-ca37-4b95-a7e4-a62bfdc1db6c",
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

  render() {
    return (
    	<Grid style={{marginTop: "75px"}}>
        <Row className="display-WIPs homepage-section">
          <div className="section-divider">
            <span className="section-divider-title">
              Newest Works in Progress
            </span>
            <div className="section-divider-hr"></div>
          </div>
          {this.state.wips.map((WIP) => {
            return (
              <Link to={"/wip/" + WIP.id}>
                <Col sm={3} className="hompage-wip" key={WIP.id}>
                  <div className="wip-name-text">{WIP.title}</div>
                  {WIP.types[0] &&
                    <div className="wip-types-text">{WIP.types.join(', ')} |&nbsp;</div>
                  }
                  {WIP.wc > 0 &&
                    <div className="wip-wc-text">{WIP.wc} words</div>
                  }
                  {WIP.genres.map((genre) => {
                    return (
                      <div className="wip-genre-text">{genresHash[genre]}</div>
                    )
                  })}
                  <div className="wip-logline-text">{WIP.logline}</div>
                </Col>
              </Link>
            )
          })}
        </Row>
        <Row className="homepage-section">
          <Col sm={6} md={6} lg={6}>
            <div className="section-divider">
              <span className="section-divider-title">
                Newest Users
              </span>
              <div className="section-divider-hr"></div>
            </div>
            {this.state.users.map((user) => {
                return (
                  <Link to={"/user/" + user.id}>
                    <Col sm={4} className="homepage-user flex" key={user.id}>
                      <div className="homepage-avatar-url-container">
                        <Image className="homepage-avatar-url" src={user.avatarURL} responsive/>
                      </div>
                      <div className="homepage-user-name">{user.name}</div>
                    </Col>
                  </Link>
                )
              })}
          </Col>
          <Col sm={6} md={6} lg={6}>
            <div className="section-divider">
              <span className="section-divider-title">
                Newest Discussions
              </span>
              <div className="section-divider-hr"></div>
            </div>
            {this.state.threads.map((thread) => {
                return (
                  <Link to={"/thread/" + thread.id}>
                    <Col sm={12} className="homepage-thread" key={thread.id}>
                      <div className="thread-title">{thread.topic}</div>
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