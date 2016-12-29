import FirebaseAuth from 'firebase/auth';
import FirebaseDB from 'firebase/database';

export const ADD_TIME_SHEET = 'ADD_TIME_SHEET';
export const REQUEST_TIME_SHEETS = 'REQUEST_TIME_SHEETS';
export const CLEAR_TIME_SHEETS = 'CLEAR_TIME_SHEETS';
export const REMOVE_TIME_SHEET = 'REMOVE_TIME_SHEET';
export const TOGGLE_SELECTED_TIME_SHEET = 'TOGGLE_SELECTED_TIME_SHEET';
export const REQUEST_USER_INFO = 'REQUEST_USER_INFO';
export const CHANGE_VIEW = 'CHANGE_VIEW';

export const REQUEST_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error'
}

const createAsyncAction = (type, status, parameters) => {
    return Object.assign({
        type,
        async: true,
        status}, parameters);
}


export const addTimeSheet = (userInfo, startTime, endTime, outOfOffice, isWorkingDay) => {
    return {
        type: ADD_TIME_SHEET,
        status: 'success'
    }
}

export const changeView = (view) => {
    return {
        type: CHANGE_VIEW,
        view
    }
}

export const fetchUserInfo = () => (dispatch, getState) => {
    dispatch(createAsyncAction(REQUEST_USER_INFO));

    return FirebaseAuth().getRedirectResult().then(result => {
        dispatch(
            createAsyncAction(
                REQUEST_USER_INFO,
                REQUEST_STATUS.SUCCESS,
                {uid: result.user ? result.user.uid : null}));

        dispatch(getState().uid ? fetchTimeSheets(getState().uid) : clearTimeSheets());
    }).catch(error => {
        dispatch(createAsyncAction(REQUEST_USER_INFO, REQUEST_STATUS.ERROR, {error}));
        dispatch(clearTimeSheets());
    });
}

export const fetchTimeSheets = uid => dispatch => {
    dispatch(createAsyncAction(REQUEST_TIME_SHEETS));

    return FirebaseDB().ref('hours/' + uid).once('value').then(snapshot => dispatch(
        createAsyncAction(REQUEST_TIME_SHEETS, REQUEST_STATUS.SUCCESS, {
            timeSheets: snapshot.val()
        })
    )).catch(error => dispatch(
        createAsyncAction(REQUEST_TIME_SHEETS, REQUEST_STATUS.ERROR, {error})
    ));
}

export const removeTimeSheet = key => (dispatch, getState) => {
    dispatch(createAsyncAction(REMOVE_TIME_SHEET));

    const databaseRef = FirebaseDB().ref(`hours/${getState().uid}/${key}`);

    return databaseRef.remove().then(() => dispatch(
        createAsyncAction(REMOVE_TIME_SHEET, REQUEST_STATUS.SUCCESS, {key})
    )).catch(error => dispatch(
        createAsyncAction(REMOVE_TIME_SHEET, REQUEST_STATUS.ERROR, {error})
    )).then(() => databaseRef.off());
}

export const clearTimeSheets = () => {
    return {
        type: CLEAR_TIME_SHEETS
    }
}

export const toggleSelectedTimeSheet = key => {
    return {
        type: TOGGLE_SELECTED_TIME_SHEET,
        key
    }
}

