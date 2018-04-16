import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Logout from './components/Logout';
import './HomePage.css';
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

    this.usersRef = firebaseDB.database().ref(`/Users`).orderByChild('creationDate').limitToFirst(6)
    this.wipsRef = firebaseDB.database().ref(`/WIPs`).orderByChild('creationDate').limitToFirst(5)
    this.threadsRef = firebaseDB.database().ref(`/Threads`).orderByChild('date').limitToLast(5)

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
            avatarURL: user.avatarURL
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
    	<div>
        	<BrowserRouter>
          <div style={{marginTop: "100px"}}>
            {this.state.users.map((user) => {
                return (
                  <Link to={"/user/" + user.id}>
                  <div className="wip-summary" key={user.id}>
                    <div className="wip-name-text">{user.name}</div>
                  </div>
                  </Link>
                )
              })}
            <div className="display-WIPs">
              {this.state.wips.map((WIP) => {
                return (
                  <Link to={"/wip/" + WIP.id}>
                  <div className="wip-summary" key={WIP.id}>
                    <div className="wip-name-text">{WIP.title}</div>
                    <div className="wip-types-text">{WIP.types.join(', ')} |&nbsp;</div><div className="wip-wc-text">{WIP.wc} words</div>
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
            {this.state.threads.map((thread) => {
                return (
                  <Link to={"/thread/" + thread.id}>
                  <div className="wip-summary" key={thread.id}>
                    <div className="wip-name-text">{thread.topic}</div>
                  </div>
                  </Link>
                )
              })}
          </div>
    		</BrowserRouter>
    	</div>
    );
  }
}

export default HomePage;