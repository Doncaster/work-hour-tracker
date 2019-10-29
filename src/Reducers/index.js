import {combineReducers} from 'redux';
import {timeSheets} from './timeSheets';
import {uid} from './userInfo';
import {CHANGE_VIEW, REPORT_FORM_CHANGED, CLEAR_REPORT_FORM, CHANGE_REPORT_TIMEFRAME} from '../Actions';
import {REPORT_TIMEFRAME_SELECTIONS} from '../constants';

let onGoingRequests = 0;

const isLoading = (state = false, action) => {
    if (action.async) {
        !action.status ? onGoingRequests++ : onGoingRequests--;
        return onGoingRequests !== 0;
    } else {
        return state;
    }
}

const currentView = (state = null, action) => {
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

const reportTimeframe = (state = REPORT_TIMEFRAME_SELECTIONS.ONE_MONTH, action) => {
    switch (action.type) {
        case CHANGE_REPORT_TIMEFRAME:
            return action.value;
        default:
            return state;
    }
}

const hourTrackerApp = combineReducers({
    uid,
    isLoading,
    currentView,
    timeSheets,
    reportForm,
    reportTimeframe
});

export default hourTrackerApp;
