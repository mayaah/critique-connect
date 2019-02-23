import React, { Component } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { Checkbox, TextArea } from "@blueprintjs/core";
import Select from 'react-select';
import { Grid, Row, Col, Image, Button, Tooltip, OverlayTrigger, Label } from 'react-bootstrap';
import TextareaAutosize from 'react-autosize-textarea';
import { firebaseDB, base } from '../base'

const GENRES = [
  { label: "Adventure", value: "adventure" },
  { label: "Chick Lit", value: "cl"},
  { label: "Contemporary, Mainstream, & Realistic", value: "cmrf" },
  { label: "Children's", value: "children" },
  { label: "Erotic", value: "erotic" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Historical", value: "historical" },
  { label: "Horror & Supernatural", value: "hs" },
  { label: "LGBT+", value: "lgbt" },
  { label: "Literary", value: "literary" },
  { label: "Memoir & Autobiography", value: "ma" },
  { label: "Middle Grade", value: "mg" },
  { label: "Mystery, Thriller, & Suspense", value: "mts" },
  { label: "New Adult", value: "na" },
  { label: "Other Nonfiction", value: "nonfiction"},
  { label: "Religious, Spiritual, & New Age", value: "rsna" },
  { label: "Romance", value: "romance" },
  { label: "Satire, Humor, & Parody", value: "shp" },
  { label: "Science Fiction", value: "sf" },
  { label: "Women's", value: "wf" },
  { label: "Young Adult", value: "ya" }
];

const TYPES = [
  { label: "Fiction", value: "Fiction" },
  { label: "Nonfiction", value: "Nonfiction"},
  { label: "Novel", value: "Novel"},
  { label: "Novella", value: "Novella"},
  { label: "Poetry", value: "Poetry"},
  { label: "Short Story", value: "Short Story"},
  { label: "Screenplay", value: "Screenplay"},
  { label: "Anthology", value: "Anthology"}
];

const LANGUAGES = [
  { label: "English", value: "English" },
  { label: "Chinese", value: "Chinese"},
  { label: "German", value: "German" },
  { label: "Spanish", value: "Spanish" },
  { label: "Japanese", value: "Japanese" },
  { label: "Russian", value: "Russian" },
  { label: "French", value: "French" },
  { label: "Korean", value: "Korean" },
  { label: "Italian", value: "Italian" },
  { label: "Dutch", value: "Dutch" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Hindi", value: "Hindi"},
  { label: "Other", value: "Other"}
]

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
        typs: WIP.types ? WIP.types.join(",") : ""
      });
    });
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
    this.EditWIPForm.reset()
    this.setState({ redirect: true })
  }

  componentWillUnmount() {
    this.WIPRef.off();
    this.genresRef.off();
    this.typesRef.off();
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
                  options={LANGUAGES}
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
                  options={TYPES}
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
                  options={GENRES}
                  placeholder="Select your favorite(s)"
                  simpleValue
                  value={this.state.genres}
                />
              </label>
              <label className="pt-label form-field-box"> 
                <span className="label-field-name">
                  Disclaimers
                </span>
                <TextareaAutosize 
                  className="textarea-field" 
                  large={true} 
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
                <TextareaAutosize 
                  className="textarea-field" 
                  large={true} 
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
                  large={true} 
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
                  large={true} 
                  value={this.state.additionalNotes} 
                  name="additionalNotes" 
                  onChange={this.handleChange} 
                  label="Additional Notes"
                />
              </label>
              <input 
                type="submit" 
                className="black-bordered-button" 
                value="Save"
              >
              </input>
            </form>
          </Grid>
        </BrowserRouter>
      </div>
    )
  }
}

export default EditWIPForm;
