import React, { Component } from 'react'
import { firebaseDB } from './base'

class User extends Component {
  constructor() {
    super()
    this.setDisplayName = this.setDisplayName.bind(this)
    this.state = {
      displayName: ''
    }
  }

  setUserID(id) {
  	this.id = id
  }

  setDisplayName(displayName) {
  	this.displayName = displayName
  }

  createNewUser(user) {
  	firebaseDB.database().ref(`Users/${user.uid}`).set({
      displayName: user.displayName
    });
  }
}
export default User;
