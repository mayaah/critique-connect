import React, { Component } from 'react';
import {Highlight} from 'react-instantsearch/dom';

class UserSearchItem extends Component {

  render() {


    return (

      <div style={{marginTop: '10px'}}>
      	<Highlight attribute="displayName" hit={this.props.hit} />
      </div>
    );

  }
}

export default UserSearchItem;