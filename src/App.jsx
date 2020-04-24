import React from 'react';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import * as Firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import HourTrackerApp from './Reducers';
import {fetchUserInfo} from './Actions';
import sagas from './Actions/Sagas';

import UserAwareApp from './Containers/UserAwareApp';

import './App.less';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

Firebase.initializeApp(firebaseConfig);

const sagaMiddleware = createSagaMiddleware();

const middlewares = [];

if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
}

middlewares.push(sagaMiddleware);

const store = createStore(HourTrackerApp, applyMiddleware(...middlewares));

sagaMiddleware.run(sagas, store.getState);

store.dispatch(fetchUserInfo());

export default function() {
    return (
        <Provider store={store}>
            <UserAwareApp />
        </Provider>
    );
}
