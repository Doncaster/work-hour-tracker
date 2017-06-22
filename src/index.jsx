import React from 'react';
import ReactDOM from 'react-dom';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import Firebase from 'firebase/app';

import HourTrackerApp from './Reducers';
import {fetchUserInfo} from './Actions';
import sagas from './Actions/Sagas';

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

const sagaMiddleware = createSagaMiddleware();

const middlewares = [];

if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
}

middlewares.push(sagaMiddleware);

const store = createStore(HourTrackerApp, applyMiddleware(...middlewares));

sagaMiddleware.run(sagas, store.getState);

ReactDOM.render(
    <Provider store={store}>
        <UserAwareApp />
    </Provider>,
    document.getElementById('root')
);

store.dispatch(fetchUserInfo());
