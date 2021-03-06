import {REQUEST_USER_INFO, REQUEST_STATUS} from '../Actions/Async';

const handleUserInfoRequest = (status, uid, error) => {
    switch (status) {
        case REQUEST_STATUS.SUCCESS:
            return uid;
        case REQUEST_STATUS.ERROR:
            console.error(error);
            return null;
        default:
            return null;
    }
}

export const uid = (state = null, action) => {
    switch (action.type) {
        case REQUEST_USER_INFO:
            return handleUserInfoRequest(action.status, action.uid, action.error);
        default:
            return state;
    }
}
