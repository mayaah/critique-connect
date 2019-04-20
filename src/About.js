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
              <p>Hi, I'm Maya and I created Critique Connected! When I was younger my goal in life was to be a published
              author. I ended up as a software engineer instead. But as a result, I can merge my two passions, take what I
              learned in the book publishing world and what I learned in the tech world into websites like this.</p>

              <p>As a writer and beta reader, I identified a pain point in the writing community: finding other writers and
              beta readers. You can't have your friends or family read over your work so you had to find strangers on the Internet.
              Right now you can can go to&nbsp;
              <a href="https://www.goodreads.com/group/show/50920-beta-reader-group" target="_blank" rel="noopener noreferrer">Goodreads groups</a>,&nbsp;
              <a href="https://www.facebook.com/groups/1662819743977604/" target="_blank" rel="noopener noreferrer">Facebook groups</a>, or various&nbsp;
              <a href="https://absolutewrite.com/forums/forumdisplay.php?30-Beta-Readers-Mentors-and-Writing-Buddies" target="_blank" rel="noopener noreferrer">writing forums</a>.
              But there was no good way to search or filter out this content that often got lost and disorganized. Moreover, this content was 
              rarely presented in a uniform way and missed crucial information like word count, genres, or what the work was about in the first place.
              Critique Connect tries to mitigate all of this.</p>

              <p>Though largely create for fun, I hope Critique Connect enables all of you to improve your works in progress and make
              new quality connections in the writing community.</p>

              <p>Critique Connect is still in its early stages so there can definitely be improvements. Feel free to reach out to me 
              about these or for anything, really!</p>

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
