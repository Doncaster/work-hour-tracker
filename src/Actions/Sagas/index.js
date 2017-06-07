import Firebase from 'firebase/app';
import { all, apply, put, takeEvery, takeLatest } from 'redux-saga/effects';
import Async, { REQUEST_STATUS, REQUEST_USER_INFO, REQUEST_TIME_SHEETS, REMOVE_TIME_SHEET, SAVE_REPORT_FORM } from '../Async';
import { clearTimeSheets, clearReportForm } from '../index';

function* fetchUserInfo() {
    try {
        const userInfo = yield apply(Firebase.auth(), Firebase.auth().getRedirectResult);
        yield put(Async.requestUserInfo(REQUEST_STATUS.SUCCESS, {uid: userInfo.user ? userInfo.user.uid : null}));
        yield put(userInfo.user ? Async.requestTimeSheets() : clearTimeSheets());
    } catch(error) {
        console.log(error);
        yield put(Async.requestUserInfo(REQUEST_STATUS.ERROR, {error}));
        yield put(clearTimeSheets());
    }
}

function* fetchTimeSheets(getState) {
    const databaseRef = Firebase.database().ref('hours/' + getState().uid);
    try {
        const snapshot = yield apply(databaseRef, databaseRef.once, ['value']);
        yield put(Async.requestTimeSheets(REQUEST_STATUS.SUCCESS, {timeSheets: snapshot.val()}));
    } catch (error) {
        console.log(error);
        yield put(Async.requestTimeSheets(REQUEST_STATUS.ERROR, {error}));
    }
    databaseRef.off();
}

function* removeTimeSheet(getState, action) {
    const databaseRef = Firebase.database().ref(`hours/${getState().uid}/${action.key}`);
    try {
        yield apply(databaseRef, databaseRef.remove);
        yield put(Async.requestTimeSheetRemoval(REQUEST_STATUS.SUCCESS, {key: action.key}));
    } catch (error) {
        console.log(error);
        yield put(Async.requestTimeSheetRemoval(REQUEST_STATUS.ERROR, {error}));
    }
    databaseRef.off();
}

function* saveReportForm(getState, action) {
    const databaseRef = Firebase.database().ref('hours/' + getState().uid);
    try {
        const databasePush = databaseRef.push();
        yield apply(databasePush, databasePush.set, [action.timesheet]);
        yield put(Async.requestReportFormSave(REQUEST_STATUS.SUCCESS));
        databaseRef.off();
        yield all([
            put(clearTimeSheets()),
            put(clearReportForm())
        ]);
        yield put(Async.requestTimeSheets());
    } catch (error) {
        console.log(error);
        yield put(Async.requestReportFormSave(REQUEST_STATUS.ERROR, {error}));
        databaseRef.off();
    }
}

const createWatcher = (name, handler, take) =>
    function* (...args) {
        yield take(action => {
            return (action.type === name && !action.status);
        }, handler, ...args);
    };

export default function* (getState) {
    yield all([
        createWatcher(REQUEST_USER_INFO, fetchUserInfo, takeLatest)(),
        createWatcher(REQUEST_TIME_SHEETS, fetchTimeSheets, takeLatest)(getState),
        createWatcher(REMOVE_TIME_SHEET, removeTimeSheet, takeEvery)(getState),
        createWatcher(SAVE_REPORT_FORM, saveReportForm, takeEvery)(getState)
    ]);
};
