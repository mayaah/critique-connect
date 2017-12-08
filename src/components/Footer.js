import React, { Component } from 'react';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = { year: new Date().getFullYear() };
  }

  render() {
    return (
      <footer>
        © {this.state.year} The Seas
      </footer>
    );
  }
}

export default Footer;