import {REQUEST_USER_INFO, REQUEST_STATUS} from '../Actions';

const handleUserInfoRequest = (status, uid, error) => {
    switch (status) {
        case REQUEST_STATUS.SUCCESS:
            return uid;
        case REQUEST_STATUS.ERROR:
            console.error(error);
        default:
            return null;
    }
}

export const uid = (state = null, action) => {
    console.log(state, action);
    switch (action.type) {
        case REQUEST_USER_INFO:
            return handleUserInfoRequest(action.status, action.uid, action.error);
        default:
            return state;
    }
}
