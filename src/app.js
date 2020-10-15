import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import 'normalize-css/normalize.css';
import 'react-dates/lib/css/_datepicker.css';

import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';

import {loginFulfilled} from './actions/auth';

import './styles/base.css';

const store = configureStore();

const user = JSON.parse(sessionStorage.getItem('user'));

if (user && user.token) {
    store.dispatch(loginFulfilled(user));
}

const appNode = document.createElement('div');
appNode.setAttribute('id', 'app');
document.body.appendChild(appNode);

const jsx = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));
