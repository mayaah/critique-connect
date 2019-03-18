import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

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
          <Col sm={12}>
            <div>About</div>
            <div>Contact</div>
            © {this.state.year} Critique Connect
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Footer;
