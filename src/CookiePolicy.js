import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

class CookiePolicy extends Component {

  render() {
    return (
      <Grid style={{ marginTop: "75px" }}>
      	<div className="splash-section-title">Cookie Policy</div>
      	<Row style={{ marginTop: "75px" }}>
      		<Col sm={2} md={2} lg={2}></Col>
      		<Col sm={8} md={8} lg={8}>
      			<div className="section-long-text">
      				<p>Like many websites Critique Connect uses cookies — small text files that are 
              placed on your machine to help the site provide a better user experience. In 
              general, cookies are used to retain user preferences, store information for 
              things like shopping carts, and provide anonymised tracking data to third 
              party applications like Google Analytics. As a rule, cookies will make your 
              browsing experience better our use is minimal and does not identify you as an 
              individual. However, you may prefer to disable cookies on this site and on others. 
              The most effective way to do this is to disable cookies in your browser. We 
              suggest consulting the Help section of your browser or taking a look at the  
              <a href="http://www.aboutcookies.org/"> About Cookies website</a> which offers 
              guidance for all modern browsers.</p>
      			</div>
      		</Col>
      		<Col sm={2} md={2} lg={2}></Col>
      	</Row>
      </Grid>
    );
  }

}

export default CookiePolicy;
