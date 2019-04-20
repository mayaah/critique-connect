import React, { Component } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import Select from 'react-select';
import { Grid } from 'react-bootstrap';
import TextareaAutosize from 'react-autosize-textarea';
import * as constants from '../constants';
import { firebaseDB } from '../base';

class EditWIPForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      currentUser: firebaseDB.auth().currentUser,
      WIPId: this.props.match.params.wipId,
      title: "",
      wordCount: "",
      genres: "",
      logline: "",
      draft: "",
      types: "",
      language: "",
      disclaimers: "",
      improvementAreas: "",
      blurb: "",
      additionalNotes: ""
    }
    this.WIPRef = firebaseDB.database().ref(`WIPs/${this.state.WIPId}`);
    this.genresRef = firebaseDB.database().ref(`/WIPs/${this.state.WIPId}/genres`);
    this.typesRef = firebaseDB.database().ref(`/WIPs/${this.state.WIPId}/types`);
    this.handleChange = this.handleChange.bind(this);
    this.handleGenreSelectChange = this.handleGenreSelectChange.bind(this);
    this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0,0);
    this.WIPRef.on('value', snapshot => {
      let WIP = snapshot.val()
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
        genres: WIP.genres ? WIP.genres.join(",") : "",
        types: WIP.types ? WIP.types.join(",") : ""
      });
    });
  }

  componentWillUnmount() {
    this.WIPRef.off();
    this.genresRef.off();
    this.typesRef.off();
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

  updateWIP(event) {
    event.preventDefault()
    if (this.state.title.length === 0 && this.state.logline.length > 141) {
      alert("Title cannot be blank and logline cannot be more than 140 characters.")
      return false
    }
    if (this.state.title.length === 0) {
      alert("Title cannot be blank.")
      return false
    }
    if (this.state.logline.length > 141) {
      alert("Logline cannot be more than 140 characters.")
      return false
    }
    this.WIPRef.update({
      title: this.state.title,
      wc: this.state.wordCount,
      logline: this.state.logline,
      draft: this.state.draft,
      language: this.state.language,
      disclaimers: this.state.disclaimers,
      improvementAreas: this.state.improvementAreas,
      blurb: this.state.blurb,
      additionalNotes: this.state.additionalNotes,
      genres : this.state.genres.split(","),
      types: this.state.types.split(",")

    })
    this.addOrUpdateWIPIndexRecord(this.state.WIPId)
    this.EditWIPForm.reset()
    this.setState({ redirect: true })
  }

addOrUpdateWIPIndexRecord(wipId) {
  const WIPRef = firebaseDB.database().ref(`WIPs/${wipId}`);
  WIPRef.on('value', snapshot => {
    console.log("ADD WIP")
    // Get Firebase object
    const record = snapshot.val();
    // Specify Algolia's objectID using the Firebase object key
    record.objectID = snapshot.key;

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
}

  render() {
    if (this.state.redirect === true) {
      return <Redirect to= {{pathname: '/wip/' + this.state.WIPId}} />
    }
    return (
      <div>
        <BrowserRouter>
          <Grid style={{marginTop: "100px"}}>
            <div className="form-name">
              Edit Work in Progress
            </div>
            <form className="center-form" 
                  onSubmit={(event) => this.updateWIP(event)} 
                  ref={(form) => this.EditWIPForm = form}
            >
              <label className="pt-label form-field-box">
                <span className="label-field-name">
                  Title
                </span>
                <input 
                  className="pt-input input-field" 
                  value={this.state.title} 
                  name="title" 
                  onChange={this.handleChange} 
                  type="text" 
                  placeholder={this.state.title}
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
                  onChange={this.handleChange} 
                  type="number" 
                  placeholder={this.state.wordCount}
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
                  Types
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
                  Genres
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
                  label="Disclaimers"
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
                  label="Additional Notes"
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

export default EditWIPForm;
