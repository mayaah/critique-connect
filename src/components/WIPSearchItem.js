import React, { Component } from 'react';
import {Highlight} from 'react-instantsearch/dom';

class WIPSearchItem extends Component {

  render() {


    return (

      <div style={{marginTop: '10px'}}>
      	<Highlight attribute="title" hit={this.props.hit} />
      </div>
    );

  }
}

export default WIPSearchItem;