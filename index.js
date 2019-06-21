import React from 'react'
import ReactDOM from 'react-dom';

import App from './components/App.jsx';
// Require Sass file so webpack can build it
import { BrowserRouter } from 'react-router-dom';
ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));