import {combineReducers} from 'redux';
// import timeSheets from './timeSheets';
import {uid} from './userInfo';

let onGoingRequests = 0;

const isLoading = (state = false, action) => {
    if (action.async) {
        !action.status ? onGoingRequests++ : onGoingRequests--;
        return onGoingRequests !== 0;
    } else {
        return state;
    }
}

const hourTrackerApp = combineReducers({
    uid,
    isLoading
});

export default hourTrackerApp;
