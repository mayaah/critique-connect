import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { TwitterTimelineEmbed } from 'react-twitter-embed';


const footerStyle = {
  marginTop: "100px",
  marginBottom: "100px",
}

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = { year: new Date().getFullYear() };
  }

  render() {
    return (
      <Grid style={footerStyle}>
        <Row>
          <Col sm={3}>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
              <Link to={"/about"} onClick={()=>{window.location.href = '/about';}}>About</Link>
              <div><a href="mailto:hello.critique.connect@gmail.com">Contact</a></div>
              <div><a href="https://app.termly.io/document/privacy-policy/d9c6ad79-5d28-4280-a336-1aec3f7c57eb">Privacy Policy</a></div>
              <Link to={"/cookie_policy"} onClick={()=>{window.location.href = '/cookie_policy';}}>Cookie Policy</Link>
            </div>
          </Col>
          <Col sm={3}>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
              <div><a href="https://forms.gle/Fb1RioocPeSFcydc6">Report a Bug</a></div>
              <div><a href="https://forms.gle/WrscevVDScaHDmtFA">Product Feedback</a></div>
            </div>
          </Col>
          <Col sm={3}>
            <div style={{ alignItems: "center", display: "flex", flexDirection: "column" }}>
              <a href="https://www.facebook.com/critiqueconnect" target="_blank" rel="noopener noreferrer">
                <Image 
                  className="social-icons" 
                  src={require('../images/fb-icon-red.png')} 
                />
                facebook.com/critiqueconnect
              </a>
              <a href="https://twitter.com/critiqueconnect" target="_blank" rel="noopener noreferrer">
                <Image 
                  className="social-icons" 
                  src={require('../images/twitter-icon-red.png')} 
                />
                twitter.com/critiqueconnect
              </a>
            </div>
          </Col>
          <Col sm={3}>
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="critiqueconnect"
              options={{height: 200, width: 300}}
            />
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
              © {this.state.year} Critique Connect
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Footer;
