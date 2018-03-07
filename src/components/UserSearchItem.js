import React, { Component } from 'react';
import {Highlight} from 'react-instantsearch/dom';

class UserSearchItem extends Component {

  render() {


    return (
      <div style={{marginTop: '10px'}}>
      	{this.props.hit.displayName}
      </div>
    );

  }
}

export default UserSearchItem;