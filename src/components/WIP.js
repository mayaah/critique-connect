import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { firebaseDB, base } from '../base';
import algoliasearch from 'algoliasearch';

const genresHash = {
  adventure: "Adventure",
  cl: "Chick Lit",
  cmrf: "Contemporary, Mainstream, & Realistic",
  children: "Children's",
  erotic: "Erotic",
  fantasy: "Fantasy",
  historical: "Historical",
  hs: "Horror & Supernatural",
  lgbt: "LGBT+",
  literary: "Literary",
  ma: "Memoir & Autobiography",
  mg: "Middle Grade",
  mts: "Mystery, Thriller, & Suspense",
  na: "New Adult",
  nonfiction: "Other Nonfiction",
  rsna: "Religious, Spiritual, & New Age",
  romance: "Romance",
  shp: "Satire, Humor, & Parody",
  sf: "Science Fiction",
  wf: "Women's",
  ya: "Young Adult"
}

const typesHash = {
  fiction: "Fiction",
  nonfiction: "Nonfiction",
  novella: "Novella",
  poetry: "Poetry",
  ss: "Short Story",
  sp: "Screenplay",
  anthology: "Anthology"
}

const algolia = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_API_KEY,
  {protocol: 'https:'}
)
const wipsIndex = algolia.initIndex(process.env.REACT_APP_ALGOLIA_WIPS_INDEX_NAME)

class WIP extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirect: false,
      wipId: this.props.match.params.wipId,
      currentUserId: firebaseDB.auth().currentUser ? firebaseDB.auth().currentUser.uid : "",
      writer: "",
      writerName: "",
      title: "",
      wordCount: "",
      genres: [],
      logline: "",
      types: [],
      language: "",
      draft: "",
      disclaimers: "",
      improvementAreas: "",
      blurb: "",
      additionalNotes: ""
    }
    this.WIPRef = firebaseDB.database().ref(`WIPs/${this.state.wipId}`);
    this.deleteWIPIndexRecord = this.deleteWIPIndexRecord.bind(this);
  }

  componentWillMount() {
    this.WIPRef.on('value', snapshot => {
      let WIP = snapshot.val()
      if (WIP) {
        this.setState({
          title: WIP.title ? WIP.title : "",
          wordCount: WIP.wc ? WIP.wc : "",
          logline: WIP.logline ? WIP.logline : "",
          draft: WIP.draft ? WIP.draft : "",
          language: WIP.language ? WIP.language : "",
          disclaimers: WIP.disclaimers ? WIP.disclaimers : "",
          improvementAreas: WIP.improvementAreas ? WIP.improvementAreas : "",
          blurb: WIP.blurb ? WIP.blurb : "",
          additionalNotes: WIP.additionalNotes ? WIP.additionalNotes : "",
          writer: WIP.writer ? WIP.writer : "",
          genres: WIP.genres ? WIP.genres : [],
          types: WIP.types ? WIP.types : []
        });
        var promises = []
        var writerRef = firebaseDB.database().ref(`/Users/${WIP.writer}`)
        promises.push(writerRef.once('value')); 
        Promise.all(promises).then((snapshots) => {
          snapshots.forEach((snapshot) => {
            var writer = snapshot.val()
            this.setState({
              writerName: writer.displayName ? writer.displayName : ""
            })
          })
        })
      }
    })
  }

  componentDidUpdate(nextProps) {
    window.scrollTo(0,0);
  }

  componentWillUnmount() {
    this.WIPRef.off();
  }

  removeWIP() {
    this.setState({ redirect: true })
    const usersWIPRef = firebaseDB.database().ref(`/Users/${this.state.writer}/WIPs/${this.state.wipId}`)
    this.deleteWIPIndexRecord(this.state.wipId)
    usersWIPRef.remove();
    this.WIPRef.remove();
  }

  deleteWIPIndexRecord(wipId) {
    const WIPRef = firebaseDB.database().ref(`WIPs/${wipId}`);
    WIPRef.on('value', snapshot => {
    // Get Algolia's objectID from the Firebase object key
    const objectID = snapshot.key;
    // Remove the object from Algolia
    wipsIndex
      .deleteObject(objectID)
      .then(() => {
        console.log('Firebase object deleted from Algolia', objectID);
      })
      .catch(error => {
        console.error('Error when deleting contact from Algolia', error);
        process.exit(1);
      });
    })
  }

  render() {
    if (this.state.redirect === true) {
      return <Redirect to= {{pathname: '/user/' + this.state.writer}} />
    }
    return (
      <Grid className="wip-page" style={{ marginTop: "100px" }}>
        <Row className="wip-header">
          <Col sm={12}>
            <div className="flex wip-title-and-buttons">
              <div className="wip-title">
                {this.state.title}
              </div>
              <div className="wip-buttons flex">
                {this.state.writer == this.state.currentUserId && (
                  <Button className="black-bordered-button">
                    <Link className="flex" to={"/edit_wip/" + this.state.wipId}>
                      <span className="edit-wip-text">
                        Edit WIP
                      </span>
                    </Link>
                  </Button>
                )}
                {this.state.writer == this.state.currentUserId && (
                  <Button className="black-bordered-button" 
                          onClick={() => this.removeWIP()}
                  >
                    Remove Item
                  </Button>
                )}
              </div>
            </div>
            <Link to={"/user/" + this.state.writer}>
              <div className="wip-writer">
                By {this.state.writerName}
              </div>
            </Link>
            {this.state.logline.length > 0 && (
              <div className="wip-logline">
                {this.state.logline}
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col className="wip-left-col" sm={4}>
            {this.state.wordCount.length > 0 && (
              <div className="wip-section">
                <div className="section-divider small-section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Wordcount
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <div className="small-field-text">
                  {this.state.wordCount} words
                </div>
              </div>
            )}
            {this.state.language.length > 0 && (
              <div className="wip-section">
                <div className="section-divider small-section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Language
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <div className="small-field-text">
                  {this.state.language}
                </div>
              </div>
            )}
            {this.state.types[0] && (
              <div className="wip-section">
                <div className="section-divider small-section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Type(s)
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <div className="display-field-list">
                  <div className="wrapper">
                    {this.state.types.map((type) => {
                      return (
                        <div className="small-field-text">
                          {type}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
            {this.state.genres[0] && (
              <div className="wip-section">
                <div className="section-divider small-section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Genre(s)
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <div className="display-field-list">
                  <div className="wrapper">
                      {this.state.genres.map((genre) => {
                        return (
                          <div className="small-field-text" key={genre}>
                            {genresHash[genre]}
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )}
            {this.state.draft.length > 0 && (
              <div className="wip-section">
                <div className="section-divider small-section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Draft
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <div className="small-field-text">
                  {this.state.draft}
                </div>
              </div>
            )}
            {this.state.disclaimers.length > 0 && (
              <div className="wip-section">
                <div className="section-divider small-section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Disclaimers
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <div className="small-field-text">
                  {this.state.disclaimers}
                </div>
              </div>
            )}
            {this.state.improvementAreas.length > 0 && (
              <div className="wip-section">
                <div className="section-divider small-section-divider">
                  <span className="section-divider-title small-section-divider-title">
                    Improvement Areas
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <div className="small-field-text">
                  {this.state.improvementAreas}
                </div>
              </div>
            )}
          </Col>
          <Col className="wip-right-col" sm={8}>
            <div className="section-divider">
              <span className="section-divider-title">
                Blurb
              </span>
              <div className="section-divider-hr"></div>
            </div>
            {this.state.blurb.length > 0 ? (
              <div className="section-long-text">
                {this.state.blurb}
              </div>
            ) : (
              <div className="no-data">
                There's no blurb for {this.state.title} yet!
              </div>
            )}
            {this.state.additionalNotes.length > 0 && (
              <div className="wip-section">
                <div className="section-divider">
                  <span className="section-divider-title">
                    Additional Notes
                  </span>
                  <div className="section-divider-hr"></div>
                </div>
                <div className="section-long-text">
                  {this.state.additionalNotes}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default WIP;
