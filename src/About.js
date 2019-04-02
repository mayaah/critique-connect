import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

class About extends Component {

  render() {
    return (
      <Grid style={{ marginTop: "75px" }}>
      	<div className="splash-section-title">About <span className="red">Critique Connect</span>...</div>
      	<Row style={{ marginTop: "75px" }}>
      		<Col sm={2} md={2} lg={2}></Col>
      		<Col sm={8} md={8} lg={8}>
      			<div className="section-long-text">
      				<p>Hi, I'm Maya and I created Critique Connect! Partly to learn some new technologies but also 
      				because I noticed a need in the writing community for a better way to connect writers and beta
      				readers together.</p>

      				<p>Right now if you're a writer or beta reader, to look for the other you can go on&nbsp;
      				<a href="https://www.goodreads.com/group/show/50920-beta-reader-group" target="_blank" rel="noopener noreferrer">Goodreads groups</a>,&nbsp;
      				<a href="https://www.facebook.com/groups/1662819743977604/" target="_blank" rel="noopener noreferrer">Facebook groups</a>, or various&nbsp;
      				<a href="https://absolutewrite.com/forums/forumdisplay.php?30-Beta-Readers-Mentors-and-Writing-Buddies" target="_blank" rel="noopener noreferrer">writing forums</a>. 
      				But there's no way to present this content in a uniform way or filter this content by what matters to 
      				you. As a beta reader, searching for things like genres you want to read, or writers won't include 
      				important details about their work in progress (WIP) like word count or what exactly they're looking for in a 
      				critique. As a writer, when searching for a beta reader it's hard to filter for beta readers who may be interested in your
      				WIP or you don't get a good sense of what they're like as a beta reader.</p>

      				<p>In Critique Connect, relevant fields such as word count, genres, type, language, disclaimers, and improvement
      				areas can be filled in for each WIP. Beta readers can include links to their social media, genres 
      				they like to read, critique style, and critique compensation. Writers can include links to their social media,
      				genres they like to write, and goals, critique tolerance. Writers and beta readers can also leave reviews for how it
      				was like to work with the other.</p>

      				<p>Critique Connect is still in its early stages so there can definitely be improvements but everything you
      				need to get a good sense of a writer/beta reader/WIP and how to contact a writer/beta reader is there, and then
      				the rest is up to you.</p>

      				<p>Thank you!</p>

      			</div>
      		</Col>
      		<Col sm={2} md={2} lg={2}></Col>
      	</Row>
      </Grid>
    );
  }

}

export default About;
