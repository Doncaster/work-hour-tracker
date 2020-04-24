import * as Firebase from "firebase/app";
import { all, apply, put, takeEvery, takeLatest } from 'redux-saga/effects';
import Async, {
    REQUEST_STATUS, REQUEST_USER_INFO, REQUEST_TIME_SHEETS,
    REMOVE_TIME_SHEET, SAVE_REPORT_FORM, PUNCH_TIME } from '../Async';
import { clearTimeSheets, clearReportForm } from '../index';
import dbMigrations from './dbMigrations';

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
    yield checkDbMigrations(getState().uid);
    const timeframe = getState().reportTimeframe;

    const databaseRef = Firebase
        .database()
        .ref(`${getState().uid}/hours`)
        .orderByChild('startTime')
        .startAt(timeframe.start.toJSON())
        .endAt(timeframe.end.toJSON())

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
    const databaseRef = Firebase.database().ref(`${getState().uid}/hours/${action.key}`);
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
    const databaseRef = Firebase.database().ref(`${getState().uid}/hours`);
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

function* punchTime(getState, action) {
    const punchDbRef = Firebase.database().ref(`${getState().uid}/punch`);
    const hoursDbRef = Firebase.database().ref(`${getState().uid}/hours`);
    try {
        const punchSnapshot = yield apply(punchDbRef, punchDbRef.once, ['value']);
        const punch = punchSnapshot.val();
        if (punch && punch.start) {
            const newHoursRef = hoursDbRef.push();
            yield apply(newHoursRef, newHoursRef.set, [{
                startTime: punch.start,
                endTime: (new Date()).toJSON(),
                outOfOffice: 0,
                target: 0
            }]);

            yield apply(punchDbRef, punchDbRef.set, [{start: null}]);
        } else {
            yield apply(punchDbRef, punchDbRef.set, [{start: (new Date()).toJSON()}]);
        }
        punchDbRef.off();
        hoursDbRef.off();

        yield put(Async.requestPunchTime(REQUEST_STATUS.SUCCESS));
        yield put(Async.requestTimeSheets());
    } catch (error) {
        console.log(error);
        yield put(Async.requestPunchTime(REQUEST_STATUS.ERROR, {error}));
        punchDbRef.off();
        hoursDbRef.off();
    }
}

function* checkDbMigrations(uid) {
    const dbVersionRef = Firebase.database().ref(`${uid}/dbVersion`);

    try {
        const dbVersionSnapshot = yield apply(dbVersionRef, dbVersionRef.once, ['value']);
        let dbVersion = dbVersionSnapshot.val();

        if(!dbVersion) {
            dbVersion = 0;
        }

        while(dbVersion < dbMigrations.length) {
            console.log('current db version', dbVersion);
            yield dbMigrations[dbVersion](uid);
            dbVersion++;
            yield apply(dbVersionRef, dbVersionRef.set, [dbVersion]);
        }
    } catch(error) {
        console.error('Migration failed', error);
    }
    dbVersionRef.off();
    console.log('Migrations done');
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
        createWatcher(SAVE_REPORT_FORM, saveReportForm, takeEvery)(getState),
        createWatcher(PUNCH_TIME, punchTime, takeEvery)(getState)
    ]);
};
