import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/dist/blueprint.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

