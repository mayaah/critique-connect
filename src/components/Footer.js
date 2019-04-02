import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const footerStyle = {
  marginTop: "100px",
  marginBottom: "25px",
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
            <Link to={"/about"} onClick={()=>{window.location.href = '/about';}}>About</Link>
            <div><a href="mailto:mayaah@berkeley.edu.com">Contact</a></div>
            <div><a href="https://forms.gle/Fb1RioocPeSFcydc6">Report a bug</a></div>
            <div><a href="https://forms.gle/WrscevVDScaHDmtFA">Feedback</a></div>
          </Col>
          <Col sm={3}></Col>
          <Col sm={3}></Col>
          <Col sm={3}>
            © {this.state.year} Critique Connect
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Footer;
