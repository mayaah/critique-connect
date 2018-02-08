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
      currentUserId: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : "",
      displayName: "",
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
    return (
        <div style={{marginTop: "100px"}}>
          <h1>{this.state.displayName}</h1>

          {(this.state.userId == this.state.currentUserId) 
            ? (
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
            )
            : (
              null
              ) 
          }
        </div>
      );
  }
}

export default UserProfile;