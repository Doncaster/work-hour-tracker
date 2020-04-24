import Async from './Async';

export const CLEAR_TIME_SHEETS = 'CLEAR_TIME_SHEETS';
export const TOGGLE_SELECTED_TIME_SHEET = 'TOGGLE_SELECTED_TIME_SHEET';
export const CHANGE_VIEW = 'CHANGE_VIEW';
export const REPORT_FORM_CHANGED = 'REPORT_FORM_CHANGED';
export const CLEAR_REPORT_FORM = 'CLEAR_REPORT_FORM';
export const CHANGE_REPORT_TIMEFRAME = 'CHANGE_REPORT_TIMEFRAME';

export const changeView = (view) => {
    return {
        type: CHANGE_VIEW,
        view
    }
};

export const fetchUserInfo = () => Async.requestUserInfo();

export const fetchTimeSheets = () => Async.requestTimeSheets();

export const removeTimeSheet = key => Async.requestTimeSheetRemoval(undefined, {key});

export const saveReportForm = timesheet => Async.requestReportFormSave(undefined, {timesheet});

export const punchTime = () => Async.requestPunchTime();

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

export const changeReportTimeframe = (start, end) => {
    return {
        type: CHANGE_REPORT_TIMEFRAME,
        start,
        end
    }
}
