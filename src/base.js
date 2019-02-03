import Rebase from 're-base'
import firebase from 'firebase'
import algoliasearch from 'algoliasearch'

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID
}

const firebaseDB = firebase.initializeApp(config)
const base = Rebase.createClass(firebase.database())
const facebookProvider = new firebase.auth.FacebookAuthProvider()
const googleProvider = new firebase.auth.GoogleAuthProvider()
const twitterProvider = new firebase.auth.TwitterAuthProvider()

const algolia = algoliasearch(
	process.env.REACT_APP_ALGOLIA_APP_ID,
	process.env.REACT_APP_ALGOLIA_API_KEY,
	{protocol: 'https:'}
)
const usersIndex = algolia.initIndex(process.env.REACT_APP_ALGOLIA_USERS_INDEX_NAME)
const wipsIndex = algolia.initIndex(process.env.REACT_APP_ALGOLIA_WIPS_INDEX_NAME)

// const usersRef = firebaseDB.database().ref('/Users');
// const wipsRef = firebaseDB.database().ref('/WIPs');

// usersRef.on('child_added', addOrUpdateIndexRecord);
// usersRef.on('child_changed', addOrUpdateIndexRecord);
// usersRef.on('child_removed', deleteIndexRecord);

// wipsRef.on('child_added', addOrUpdateWIPIndexRecord);
// wipsRef.on('child_changed', addOrUpdateWIPIndexRecord);
// wipsRef.on('child_removed', deleteWIPIndexRecord);


// function addOrUpdateIndexRecord(user) {
//   // Get Firebase object
//   const record = user.val();
//   // Specify Algolia's objectID using the Firebase object key
//   record.objectID = user.key;
//   // Add or update object
//   usersIndex
//     .saveObject(record)
//     .then(() => {
//       console.log('Firebase object indexed in Algolia', record.objectID);
//     })
//     .catch(error => {
//       console.error('Error when indexing contact into Algolia', error);
//       process.exit(1);
//     });
// }

// function deleteIndexRecord(user) {
//   // Get Algolia's objectID from the Firebase object key
//   const objectID = user.key;
//   // Remove the object from Algolia
//   usersIndex
//     .deleteObject(objectID)
//     .then(() => {
//       console.log('Firebase object deleted from Algolia', objectID);
//     })
//     .catch(error => {
//       console.error('Error when deleting contact from Algolia', error);
//       process.exit(1);
//     });
// }

// function addOrUpdateWIPIndexRecord(wip) {
//   // Get Firebase object
//   const record = wip.val();
//   // Specify Algolia's objectID using the Firebase object key
//   record.objectID = wip.key;
//   // Add or update object
//   wipsIndex
//     .saveObject(record)
//     .then(() => {
//       console.log('Firebase object indexed in Algolia', record.objectID);
//     })
//     .catch(error => {
//       console.error('Error when indexing contact into Algolia', error);
//       process.exit(1);
//     });
// }

// function deleteWIPIndexRecord(wip) {
//   // Get Algolia's objectID from the Firebase object key
//   const objectID = wip.key;
//   // Remove the object from Algolia
//   wipsIndex
//     .deleteObject(objectID)
//     .then(() => {
//       console.log('Firebase object deleted from Algolia', objectID);
//     })
//     .catch(error => {
//       console.error('Error when deleting contact from Algolia', error);
//       process.exit(1);
//     });
// }


export { firebaseDB, base, facebookProvider, googleProvider, twitterProvider }
