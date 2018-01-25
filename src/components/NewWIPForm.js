import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';


class NewWIPForm extends Component {
  constructor(props) {
    super(props)
    this.createWIP = this.createWIP.bind(this)
    this.state = {
      redirect: false
    }
  }

  createWIP(event) {
    event.preventDefault()
    const title = this.titleInput.value
    this.props.addSong(title)
    this.WIPForm.reset()
    this.props.postSubmitHandler()
  }

  render() {
    return (
    	<div>
	    	<BrowserRouter>
		      <div style={{marginTop: "100px"}}>
		        <form onSubmit={(event) => this.createWIP(event)} ref={(form) => this.WIPForm = form}>
		          <label className="pt-label">
		            WIP Title
		            <input style={{width: "100%"}} className="pt-input" name="title" type="text" ref={(input) => { this.titleInput = input }} placeholder="Staying Alive"></input>
		          </label>
		          <input style={{width: "100%"}} type="submit" className="pt-button pt-intent-primary" value="Submit Work In Progress"></input>
		        </form>
		      </div>
	      </BrowserRouter>
      </div>
    )
  }
}

export default NewWIPForm