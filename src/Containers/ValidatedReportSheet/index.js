import {connect} from 'react-redux';
import _merge from 'lodash/merge';
import Moment from 'moment';

import ReportSheet from '../../Components/ReportSheet';

import {reportFormChanged, saveReportForm} from '../../Actions';

const DATE_REGEX = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
const TIME_REGEX = /^\d{1,2}:\d{2}$/;
const NUMBER_REGEX = /^(\d+|\d+,\d+)$/;

const staticProps = {
    dateField: {
        type: 'text',
        label: 'Date',
        placeHolder: 'yyyy/mm/dd',
        wrapperClass: 'col-md-4'
    },
    startTimeField: {
        type: 'text',
        label: 'Start time',
        placeHolder: 'hh:mm',
        wrapperClass: 'col-md-4'
    },
    endTimeField: {
        type: 'text',
        label: 'End time',
        placeHolder: 'hh:mm',
        wrapperClass: 'col-md-4'
    },
    oooField: {
        type: 'text',
        label: 'Out of office',
        placeHolder: 'e.g. 0,5',
        wrapperClass: 'col-md-4'
    },
    workingDayField: {
        label: 'Working day',
        wrapperClass: 'col-md-4',
        radios: [
            {label: 'true', value: 'true'},
            {label: 'false', value: 'false'}
        ]
    }
}

const isValid = (value, regex, allowEmpty = false) =>
    allowEmpty ? (!value || regex.test(value)) : regex.test(value);

const getWorkingDayLength = (date) =>  Moment(date, 'YYYY/M/D').isBefore('2017-01-01', 'day') ? 7.5 : 7.6;

const convertToNumber = value => {
    const normalizedValue = value ? value.replace(',', '.') : value;
    return Number(normalizedValue) === NaN ? null : Number(normalizedValue);
}

const mapStateToProps = (state) => {
    return {
        dateField: {
            value: state.reportForm.date || '',
            isValid: isValid(state.reportForm.date, DATE_REGEX, true)
        },
        startTimeField: {
            value: state.reportForm.startTime || '',
            isValid: isValid(state.reportForm.startTime, TIME_REGEX, true)
        },
        endTimeField: {
            value: state.reportForm.endTime || '',
            isValid: isValid(state.reportForm.endTime, TIME_REGEX, true)
        },
        oooField: {
            value: state.reportForm.outOfOffice || '',
            isValid: isValid(state.reportForm.outOfOffice, NUMBER_REGEX, true)
        },
        workingDayField: {
            value: state.reportForm.workingDay
        },
        submitEnabled: (
            isValid(state.reportForm.date, DATE_REGEX) &&
            isValid(state.reportForm.startTime, TIME_REGEX) &&
            isValid(state.reportForm.endTime, TIME_REGEX) &&
            isValid(state.reportForm.outOfOffice, NUMBER_REGEX) &&
            state.reportForm.workingDay),
        _timeSheet: {
            startTime: Moment(`${state.reportForm.date} ${state.reportForm.startTime}`, 'YYYY/M/D H:mm').toJSON(),
            endTime: Moment(`${state.reportForm.date} ${state.reportForm.endTime}`, 'YYYY/M/D H:mm').toJSON(),
            outOfOffice: convertToNumber(state.reportForm.outOfOffice),
            target: state.reportForm.workingDay === 'true' ? getWorkingDayLength(state.reportForm.date) : 0
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dateField: {
            onChange: value => dispatch(reportFormChanged('date', value))
        },
        startTimeField: {
            onChange: value => dispatch(reportFormChanged('startTime', value))
        },
        endTimeField: {
            onChange: value => dispatch(reportFormChanged('endTime', value))
        },
        oooField: {
            onChange: value => dispatch(reportFormChanged('outOfOffice', value))
        },
        workingDayField: {
            onChange: value => dispatch(reportFormChanged('workingDay', value))
        },
        onSubmit: timeSheet => dispatch(saveReportForm(timeSheet))
    };
}

const mergeProps = (stateProps, dispatchProps) =>  _merge(
    stateProps,
    dispatchProps,
    staticProps,
    {
        onSubmit: () => dispatchProps.onSubmit(stateProps._timeSheet)
    });

const validatedReportSheet = connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReportSheet);

export default validatedReportSheet;
