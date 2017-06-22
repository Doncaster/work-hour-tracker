export const REQUEST_USER_INFO = 'REQUEST_USER_INFO';
export const REQUEST_TIME_SHEETS = 'REQUEST_TIME_SHEETS';
export const REMOVE_TIME_SHEET = 'REMOVE_TIME_SHEET';
export const SAVE_REPORT_FORM = 'SAVE_REPORT_FORM';

export const REQUEST_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error'
};

const createAsyncAction = (type, status, parameters) => {
    return Object.assign({
        type,
        async: true,
        status}, parameters);
};

const requestUserInfo = (status, parameters) => createAsyncAction(REQUEST_USER_INFO, status, parameters);
const requestTimeSheets = (status, parameters) => createAsyncAction(REQUEST_TIME_SHEETS, status, parameters);
const requestTimeSheetRemoval = (status, parameters) => createAsyncAction(REMOVE_TIME_SHEET, status, parameters);
const requestReportFormSave = (status, parameters) => createAsyncAction(SAVE_REPORT_FORM, status, parameters);

export default {
    requestUserInfo,
    requestTimeSheets,
    requestTimeSheetRemoval,
    requestReportFormSave
};