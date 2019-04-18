import React, { Component } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import Select from 'react-select';
import TextareaAutosize from 'react-autosize-textarea';
import { Grid } from 'react-bootstrap';
import * as constants from '../constants';
import { firebaseDB } from '../base'

class NewWIPForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      userId: this.props.match.params.userId,
      wipId: "",
      title: "",
      wordCount: "",
      genres: "",
      types: "",
      logline: "",
      language: "",
      draft: "",
      disclaimers: "",
      improvementAreas: "",
      blurb: "",
      additionalNotes: "",
      creationDate: ""
    }
    this.userRef = firebaseDB.database().ref(`/Users/${this.state.userId}`)
    this.WIPsRef = firebaseDB.database().ref(`/Users/${this.state.userId}/WIPs`)
    this.handleChange = this.handleChange.bind(this);
    this.handleGenreSelectChange = this.handleGenreSelectChange.bind(this);
    this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.createWIP = this.createWIP.bind(this);
    this.addOrUpdateWIPIndexRecord = this.addOrUpdateWIPIndexRecord.bind(this);
    this.createWIP = this.createWIP.bind(this)
    this.addWIPToUser = this.addWIPToUser.bind(this)
  }

  componentDidMount() {
    window.scrollTo(0,0);
  }

  componentWillUnmount() {
    this.userRef.off();
    this.WIPsRef.off();
  }

  handleChange(event) {
    this.setState({ 
        [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  }

  handleGenreSelectChange(value) {
        this.setState({
            genres: value
        })
    }

    handleTypeSelectChange(value) {
        this.setState({
            types: value
        })
    }

    handleLanguageChange(value) {
        this.setState({
            language: value,
        });
    }

  createWIP(event) {
    event.preventDefault()
    if (this.state.title.length == 0) {
      alert("Title cannot be blank.")
      return false
    }
    const WIPsRef = firebaseDB.database().ref('WIPs');
    const WIP = {
      title: this.state.title,
      writer: this.state.userId,
      wc: this.state.wordCount,
      logline: this.state.logline,
      draft: this.state.draft,
      language: this.state.language,
      disclaimers: this.state.disclaimers,
      improvementAreas: this.state.improvementAreas,
      blurb: this.state.blurb,
      additionalNotes: this.state.additionalNotes,
      genres: this.state.genres.split(","),
      types: this.state.types.split(","),
      creationDate: Date.now()
    }
    var newWIPRef = WIPsRef.push(WIP);
    var WIPId = newWIPRef.key;
    this.setState({wipId: WIPId});
    this.addWIPToUser(WIPId)
    this.addOrUpdateWIPIndexRecord(WIPId)
    this.WIPForm.reset()
    this.setState({ redirect: true })
  }

  addWIPToUser(WIPId) {
    this.WIPsRef.update({
      [WIPId]: true
    });
  }


addOrUpdateWIPIndexRecord(wipId) {
    const WIPRef = firebaseDB.database().ref(`WIPs/${wipId}`);
    WIPRef.on('value', snapshot => {
      console.log("ADD WIP")
      // Get Firebase object
      const record = snapshot.val();
      // Specify Algolia's objectID using the Firebase object key
      record.objectID = snapshot.key;
      // Add or update object
      constants.wipsIndex
        .saveObject(record)
        .then(() => {
          console.log('Firebase object indexed in Algolia', record.objectID);
        })
        .catch(error => {
          console.error('Error when indexing contact into Algolia', error);
          process.exit(1);
        });
  })
  WIPRef.off();
}

  render() {
    if (this.state.redirect === true) {
      return <Redirect to= {{pathname: '/wip/' + this.state.wipId}} />
    }
    return (
        <div>
            <BrowserRouter>
              <Grid style={{marginTop: "100px"}}>
                <div className="form-name">
                    New Work in Progress
                </div>
                <form className="center-form" 
                            onSubmit={(event) => this.createWIP(event)} 
                            ref={(form) => this.WIPForm = form}
                >
                  <label className="pt-label form-field-box">
                    <span className="label-field-name">
                        Title
                    </span>
                    <input 
                        className="pt-input input-field" 
                        value={this.state.title} 
                        name="title" 
                        type="text" 
                        onChange={this.handleChange}
                    >
                    </input>
                  </label>
                  <label className="pt-label form-field-box">
                    <span className="label-field-name">
                        Logline
                    </span>
                    <span className="label-field-helper">
                  &nbsp;- A one sentence summary.
                </span>
                    <input 
                        className="pt-input input-field" 
                        value={this.state.logline} 
                        name="logline" 
                        type="text" 
                        onChange={this.handleChange}
                    >
                    </input>
                  </label>
                  <label className="pt-label form-field-box">
                    <span className="label-field-name">
                        Word Count
                    </span>
                    <input 
                        className="pt-input input-field" 
                        value={this.state.wordCount} 
                        name="wordCount" 
                        type="number" 
                        onChange={this.handleChange}
                    >
                    </input>
                  </label>
                  <label className="pt-label form-field-box">
                    <span className="label-field-name">
                        Draft
                    </span>
                    <span className="label-field-helper">
                  &nbsp;- Is this the first draft? Second? Hundredth?
                </span>
                    <input 
                        className="pt-input input-field" 
                        value={this.state.draft} 
                        name="draft" 
                        type="text" 
                        onChange={this.handleChange}
                    >
                    </input>
                  </label>
                  <label className="pt-label form-field-box">
                    <span className="label-field-name">
                        Language
                    </span>
                      <Select
                        className="select-field"
                                    closeOnSelect={false}
                                    disabled={false}
                                    onChange={this.handleLanguageChange}
                                    options={constants.LANGUAGES}
                                    placeholder="Select the language"
                                    simpleValue
                                    value={this.state.language}
                                />
                            </label>
                            <label className="pt-label form-field-box">
                    <span className="label-field-name">
                        Type(s)
                    </span>
                      <Select
                        className="multiselect-field"
                        closeOnSelect={false}
                                    disabled={false}
                                    multi
                                    onChange={this.handleTypeSelectChange}
                                    options={constants.TYPES}
                                    placeholder="Select the type(s) of literature"
                                    simpleValue
                                    value={this.state.types}
                                />
                            </label>
                            <label className="pt-label form-field-box">
                    <span className="label-field-name">
                        Genre(s)
                    </span>
                      <Select
                        className="multiselect-field"
                                    closeOnSelect={false}
                                    disabled={false}
                                    multi
                                    onChange={this.handleGenreSelectChange}
                                    options={constants.GENRES}
                                    placeholder="Select your favorite(s)"
                                    simpleValue
                                    value={this.state.genres}
                                />
                            </label>
                  <label className="pt-label form-field-box"> 
                    <span className="label-field-name">
                        Disclaimers
                    </span>
                    <span className="label-field-helper">
                  &nbsp;- Violence? Nudity? Foul language?
                </span>
                    <TextareaAutosize 
                        className="textarea-field" 
                                    large="true"
                        value={this.state.disclaimers} 
                        name="disclaimers" 
                        onChange={this.handleChange} 
                        label="Dicslaimers" 
                                />
                            </label>
                            <label className="pt-label form-field-box"> 
                    <span className="label-field-name">
                        Blurb
                    </span>
                    <span className="label-field-helper">
                  &nbsp;- What would the back of this book say?
                </span>
                    <TextareaAutosize 
                        className="textarea-field" 
                        large="true"
                        value={this.state.blurb} 
                        name="blurb" 
                        onChange={this.handleChange} 
                        label="Blurb" 
                                />
                            </label>
                            <label className="pt-label form-field-box"> 
                    <span className="label-field-name">
                        Improvement Areas
                    </span>
                    <TextareaAutosize 
                        className="textarea-field" 
                        large="true"
                        value={this.state.improvementAreas} 
                        name="improvementAreas" 
                        onChange={this.handleChange} 
                        label="Improvement Areas" 
                                />
                            </label>
                            <label className="pt-label form-field-box"> 
                    <span className="label-field-name">
                        Additional Notes
                    </span>
                    <TextareaAutosize 
                        className="textarea-field" 
                        large="true"
                        value={this.state.additionalNotes} 
                        name="additionalNotes" 
                        onChange={this.handleChange} 
                        label="Notes"
                                />
                            </label>
                  <button 
                    type="submit" 
                    className="black-bordered-button" 
                >
                    Save
                </button>
                </form>
              </Grid>
          </BrowserRouter>
      </div>
    )
  }
}

export default NewWIPForm;
