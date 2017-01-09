import Firebase from 'firebase/app';

export const REQUEST_TIME_SHEETS = 'REQUEST_TIME_SHEETS';
export const CLEAR_TIME_SHEETS = 'CLEAR_TIME_SHEETS';
export const REMOVE_TIME_SHEET = 'REMOVE_TIME_SHEET';
export const TOGGLE_SELECTED_TIME_SHEET = 'TOGGLE_SELECTED_TIME_SHEET';
export const REQUEST_USER_INFO = 'REQUEST_USER_INFO';
export const CHANGE_VIEW = 'CHANGE_VIEW';
export const REPORT_FORM_CHANGED = 'REPORT_FORM_CHANGED';
export const CLEAR_REPORT_FORM = 'CLEAR_REPORT_FORM';
export const SAVE_REPORT_FORM = 'SAVE_REPORT_FORM';

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

export const changeView = (view) => {
    return {
        type: CHANGE_VIEW,
        view
    }
}

export const fetchUserInfo = () => (dispatch, getState) => {
    dispatch(createAsyncAction(REQUEST_USER_INFO));

    return Firebase.auth().getRedirectResult().then(result => {
        dispatch(
            createAsyncAction(
                REQUEST_USER_INFO,
                REQUEST_STATUS.SUCCESS,
                {uid: result.user ? result.user.uid : null}));

        dispatch(getState().uid ? fetchTimeSheets() : clearTimeSheets());
    }).catch(error => {
        dispatch(createAsyncAction(REQUEST_USER_INFO, REQUEST_STATUS.ERROR, {error}));
        dispatch(clearTimeSheets());
    });
}

export const fetchTimeSheets = () => (dispatch, getState) => {
    dispatch(createAsyncAction(REQUEST_TIME_SHEETS));

    const databaseRef = Firebase.database().ref('hours/' + getState().uid);

    return databaseRef.once('value').then(snapshot => dispatch(
        createAsyncAction(REQUEST_TIME_SHEETS, REQUEST_STATUS.SUCCESS, {
            timeSheets: snapshot.val()
        })
    )).catch(error => dispatch(
        createAsyncAction(REQUEST_TIME_SHEETS, REQUEST_STATUS.ERROR, {error})
    )).then(() => databaseRef.off());
}

export const removeTimeSheet = key => (dispatch, getState) => {
    dispatch(createAsyncAction(REMOVE_TIME_SHEET));

    const databaseRef = Firebase.database().ref(`hours/${getState().uid}/${key}`);

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

export const reportFormChanged = (field, value) => {
    return {
        type: REPORT_FORM_CHANGED,
        field,
        value
    }
}

export const clearReportForm = () => {
    return {
        type: CLEAR_REPORT_FORM
    }
}

export const saveReportForm = timeSheet => (dispatch, getState) => {

    const databaseRef = Firebase.database().ref('hours/' + getState().uid);

    dispatch(createAsyncAction(SAVE_REPORT_FORM));

    return databaseRef.push().set(timeSheet).then(() => {
        dispatch(createAsyncAction(SAVE_REPORT_FORM, REQUEST_STATUS.SUCCESS));
        databaseRef.off();
        dispatch(clearReportForm());
        dispatch(fetchTimeSheets(getState().uid));
    }).catch(error => {
        dispatch(createAsyncAction(SAVE_REPORT_FORM, REQUEST_STATUS.ERROR, {error}));
        databaseRef.off();
    });
}
