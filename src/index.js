import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'normalize.css/normalize.css';
import '@blueprintjs/core/dist/blueprint.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

console.log("NODE_ENV",process.env.NODE_ENV) 
console.log("API_KEY",process.env.APP_KEY)
