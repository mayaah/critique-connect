import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Spinner } from '@blueprintjs/core';
import { firebaseDB } from '../base'

class Logout extends Component {
  constructor() {
    super()
    this.state = {
      redirect: false
    }
  }

  componentWillMount() {
    firebaseDB.auth().signOut().then((user, error) => {
      this.setState({ redirect: true })
    });
  }

  render() {
    if (this.state.redirect === true) {
      return <Redirect to="/login" />
    }

    return (
      <div style={{ textAlign: "center", position: "absolute", top: "25%", left: "50%" }}>
        <h3>Logging Out</h3>
        <Spinner />
      </div>
    )
  }
}

export default Logout