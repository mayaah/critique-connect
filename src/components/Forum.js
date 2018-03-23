import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';
import { Checkbox, TextArea, RadioGroup, Radio } from "@blueprintjs/core";

class Forum extends Component {
	constructor() {
    super()
      this.state = {
      redirect: false,
    }
  }	

  render() {

	  return (
      <Grid style={{marginTop: "100px"}}>
      	<Row>
      		<Col sm={12} className="flex forum-header">
		      	<div className="page-name">Forum</div>
		      	<Button className="black-bordered-button">
		      		<Link className="flex" to={"/submit_thread"} >New Thread</Link>
		      	</Button>
		      </Col>
	      </Row>
      </Grid>
	  );

  }
}

export default Forum