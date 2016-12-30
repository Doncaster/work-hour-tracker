import {combineReducers} from 'redux';
import {timeSheets} from './timeSheets';
import {uid} from './userInfo';
import {VIEWS} from '../Constants';
import {CHANGE_VIEW, REPORT_FORM_CHANGED, CLEAR_REPORT_FORM} from '../Actions';

let onGoingRequests = 0;

const isLoading = (state = false, action) => {
    if (action.async) {
        console.log('async action', onGoingRequests);
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

const reportForm = (state = {}, action) => {
    switch (action.type) {
        case REPORT_FORM_CHANGED:
            return Object.assign({}, state, {[action.field]: action.value})
        case CLEAR_REPORT_FORM:
            return {};
        default:
            return state;
    }
}

const hourTrackerApp = combineReducers({
    uid,
    isLoading,
    currentView,
    timeSheets,
    reportForm
});

export default hourTrackerApp;
