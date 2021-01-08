import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import './index.css';
import App from './components/App';
import apples from './store/AppleStore';

ReactDOM.render(
  <Provider store={apples}>
    <App />
  </Provider>,
  document.getElementById('root')
);