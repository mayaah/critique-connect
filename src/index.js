import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';
import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/dist/blueprint.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import * as Sentry from '@sentry/browser';

import { BrowserRouter } from 'react-router-dom';

import './index.css';
import './styles/user-profile.css';
import './styles/wip.css';
import './styles/form.css';
import './styles/search.css';
import './styles/forum.css';
import './HomePage.css';

Sentry.init({
	dsn: process.env.REACT_APP_SENTRY_DSN
});

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
