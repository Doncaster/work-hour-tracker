import {connect} from 'react-redux';
import Summary from '../../Components/Summary';
import _reduce from 'lodash/reduce';
import Moment from 'moment';

import {toggleSelectedTimeSheet, removeTimeSheet} from '../../Actions';

const mapStateToProps = (state) => {
    const timeSheets = state.timeSheets.map(current => {
        const targetInMinutes = (current.target || 0) * 60;
        const outOfOfficeInMinutes = (current.outOfOffice || 0) * 60;

        const hourReport = {
            id: current.key,
            start: new Moment(current.startTime).locale("fi"),
            end: new Moment(current.endTime),
            outOfOffice: outOfOfficeInMinutes,
            selected: current.selected
        };

        hourReport.difference = hourReport.end.diff(hourReport.start, "minutes") - targetInMinutes - outOfOfficeInMinutes;

        return hourReport;
    });

    return {
        timeSheets,
        totalDifference: _reduce(timeSheets, (result, current) => result + current.difference, 0)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRowClicked: key => dispatch(toggleSelectedTimeSheet(key)),
        onRemoveRow: key => dispatch(removeTimeSheet(key))
    }
}


const filteredSummary = connect(mapStateToProps, mapDispatchToProps)(Summary);

export default filteredSummary;
