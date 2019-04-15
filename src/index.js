import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/styles/reset.scss';
import * as serviceWorker from './serviceWorker';

import { library } from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'

import { Provider } from 'mobx-react';
import userStore from './mobx/userStore';
const stores = {
  userStore: new userStore()
};


library.add(fab, far, fas);

ReactDOM.render(
  <Provider {...stores}>
    <App/>
  </Provider>,
  document.getElementById('root'));
serviceWorker.unregister();
