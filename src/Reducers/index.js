import {combineReducers} from 'redux';
import {timeSheets} from './timeSheets';
import {uid} from './userInfo';
import {VIEWS} from '../Constants';
import {CHANGE_VIEW} from '../Actions';

let onGoingRequests = 0;

const isLoading = (state = false, action) => {
    if (action.async) {
        !action.status ? onGoingRequests++ : onGoingRequests--;
        return onGoingRequests !== 0;
    } else {
        return state;
    }
}

const currentView = (state = VIEWS.SUMMARY, action) => {
    switch (action.type) {
        case CHANGE_VIEW:
            return action.view;
        default:
            return state;
    }
}

const hourTrackerApp = combineReducers({
    uid,
    isLoading,
    currentView,
    timeSheets
});

export default hourTrackerApp;
