import FirebaseAuth from 'firebase/auth';

export const ADD_TIME_SHEET = 'ADD_TIME_SHEET';
export const REQUEST_TIME_SHEETS = 'REQUEST_TIME_SHEETS';
export const REQUEST_USER_INFO = 'REQUEST_USER_INFO';

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

export const fetchTimeSheets = (userInfo) => {
    return {
        type: REQUEST_TIME_SHEETS,
        status: 'error'
    }
}

export const fetchUserInfo = () => dispatch => {
    dispatch(createAsyncAction(REQUEST_USER_INFO));

    return FirebaseAuth().getRedirectResult().then(result => {
        dispatch(
            createAsyncAction(
                REQUEST_USER_INFO,
                REQUEST_STATUS.SUCCESS,
                {uid: result.user ? result.user.uid : null}));
    }).catch(error => {
        dispatch(createAsyncAction(REQUEST_USER_INFO, REQUEST_STATUS.ERROR, {error}));
    });
}
