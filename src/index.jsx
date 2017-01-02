import React from 'react';
import ReactDOM from 'react-dom';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ThunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import Firebase from 'firebase/app';

import HourTrackerApp from './Reducers';
import {fetchUserInfo} from './Actions';

import UserAwareApp from './Containers/UserAwareApp';
import './index.less';

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DB_URL,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID
};

Firebase.initializeApp(firebaseConfig);

const middlewares = [ThunkMiddleware].concat(process.env.NODE_ENV !== 'production' ? createLogger() : []);

const store = createStore(HourTrackerApp, applyMiddleware(...middlewares));

ReactDOM.render(
    <Provider store={store}>
        <UserAwareApp />
    </Provider>,
    document.getElementById('root')
);

store.dispatch(fetchUserInfo());
