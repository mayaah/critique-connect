import { Component } from 'react'
import { firebaseDB } from './base'

class User extends Component {
  constructor() {
    super()
    this.setDisplayName = this.setDisplayName.bind(this)
    this.addOrUpdateIndexRecord = this.addOrUpdateIndexRecord.bind(this)
    this.state = {
      displayName: ''
    }
  }

  setUserID(id) {
  	this.id = id
  }

  setDisplayName(displayName) {
  	this.displayName = displayName
  }

  createNewUser(user) {
  	firebaseDB.database().ref(`Users/${user.uid}`).set({
      displayName: user.displayName
    });
    // this.userRef = firebaseDB.database().ref(`/Users/${userId}`)
    // this.addOrUpdateIndexRecord(userRef)
  }

  // addOrUpdateIndexRecord(user) {
  // // Get Firebase object
  // const record = user.val();
  // // Specify Algolia's objectID using the Firebase object key
  // record.objectID = user.key;
  // // Add or update object
  // usersIndex
  //   .saveObject(record)
  //   .then(() => {
  //     console.log('Firebase object indexed in Algolia', record.objectID);
  //   })
  //   .catch(error => {
  //     console.error('Error when indexing contact into Algolia', error);
  //     process.exit(1);
  //   });
  // }
}
export default User;
