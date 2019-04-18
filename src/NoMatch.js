import React, { Component } from 'react';

class NoMatch extends Component {

	render() {
    return (
    	<div style={
    		{ 
    			marginTop: "75px", 
    			textAlign: "center", 
    			fontSize: "25px", 
    			height: "500px",
    			display: "flex",
    			alignItems: "center",
    			justifyContent: "center" 
    		}
    	} 
			className="red">
	 		Page Not Found :(
		</div>
  	)
  }
}

export default NoMatch;