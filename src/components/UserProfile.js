import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import NewWIPForm from './NewWIPForm';

import { firebaseDB, base } from '../base'

class UserProfile extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirect: false,
      userId: this.props.match.params.id,
      displayName: "",
      WIPs: []
    }
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.userId}`)
    this.usersWIPsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/WIPs`)
    // this.WIPsRef = firebaseDB.database().ref(`/WIPs`).on('value', snapshot => {
    //   return snapshot.val();
    // })
  }

  componentDidMount() {
    this.userRef.on('value', snapshot => {
      this.setState({
        displayName: snapshot.val().displayName
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
            id: WIPRef.key,
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

  render() {
    return (
        <div style={{marginTop: "100px"}}>
          <h1>{this.state.displayName}</h1>
          <Link className="pt-button" aria-label="Log Out" to={"/submit_wip/"+this.state.userId} >Submit a Work in Progress</Link>
          <section className='display-WIPs'>
              <div className="wrapper">
                <ul>
                  {this.state.WIPs.map((WIP) => {
                    return (
                      <li key={WIP.id}>
                        <h3>{WIP.title}</h3>
                      </li>
                    )
                  })}
                </ul>
              </div>
          </section>
        </div>
      );
  }
}

export default UserProfile;