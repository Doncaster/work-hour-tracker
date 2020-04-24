import {combineReducers} from 'redux';
import Moment from 'moment';
import {timeSheets} from './timeSheets';
import {uid} from './userInfo';
import {CHANGE_VIEW, REPORT_FORM_CHANGED, CLEAR_REPORT_FORM, CHANGE_REPORT_TIMEFRAME} from '../Actions';

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

const defaultReportTimeframeState = {
    start: Moment().subtract(1, 'months'),
    end: Moment().endOf('day')
};

const reportTimeframe = (state = defaultReportTimeframeState, action) => {
    switch (action.type) {
        case CHANGE_REPORT_TIMEFRAME:
            return {
                start: action.start,
                end: action.end
            }
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
