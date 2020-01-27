import { CLEAR_TIME_SHEETS, TOGGLE_SELECTED_TIME_SHEET } from '../Actions';
import { REQUEST_TIME_SHEETS, REQUEST_STATUS, REMOVE_TIME_SHEET } from '../Actions/Async';

const parseTimeSheets = timeSheets =>
    !timeSheets ?
    [] :
    Object
        .keys(timeSheets)
        .reduce(
            (acc, key) => acc.concat(Object.assign({}, timeSheets[key], {key})),
            []
        )
        .sort((a, b) => a < b)
        .reverse();

const timeSheet =(state = {}, action) => {
    switch (action.type) {
        case TOGGLE_SELECTED_TIME_SHEET:
            if (action.key === state.key) {
                return Object.assign({}, state, {selected: !state.selected});
            } else {
                return Object.assign({}, state, {selected: false});
            }
        default:
            return state;
    }
}

export const timeSheets = (state = [], action) => {
    switch (action.type) {
        case CLEAR_TIME_SHEETS:
            return [];
        case REQUEST_TIME_SHEETS:
            if (action.status === REQUEST_STATUS.SUCCESS) {
                console.log('testing!');
                return parseTimeSheets(action.timeSheets).map(current => timeSheet(current, action));
            } else if (action.status === REQUEST_STATUS.ERROR) {
                console.error(action.error);
                return state;
            }
        case TOGGLE_SELECTED_TIME_SHEET:
            return state.map(current => timeSheet(current, action));
        case REMOVE_TIME_SHEET:
            if(action.status === REQUEST_STATUS.SUCCESS) {
                return state.reduce(
                    (accumulator, current) => current.key !== action.key ? accumulator.concat(current) : accumulator,
                    []
                );
            } else {
                return state;
            }
        default:
            return state;
    }
}
