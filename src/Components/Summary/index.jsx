import React from "react";
import FirebaseDB from 'firebase/database';
import Moment from 'moment';
import _map from 'lodash/map';
import _reduce from 'lodash/reduce';
import _sortBy from 'lodash/sortBy';

class Summary extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hours: null
        };
    }

    componentWillMount() {
        FirebaseDB().ref("hours/" + this.props.uid).once("value").then(snapshot => {
            const sortedHours = _sortBy(snapshot.val(), current => current.startTime);
            this.setState({
                hours: _map(sortedHours, (current, key) => {
                    const targetInMinutes = (current.target || 0) * 60;
                    const outOfOfficeInMinutes = (current.outOfOffice || 0) * 60;

                    const hourReport = {
                        id: key,
                        start: new Moment(current.startTime).locale("fi"),
                        end: new Moment(current.endTime),
                        outOfOffice: outOfOfficeInMinutes
                    };

                    hourReport.difference = hourReport.end.diff(hourReport.start, "minutes") - targetInMinutes - outOfOfficeInMinutes;

                    return hourReport;
                })
            });
        });
    }

    _getHoursList = hours => {
        if (!hours) {
            return <div className="text-center">Loading...</div>;
        }

        const listItems = hours.map(hour =>
            <tr key={hour.id}>
                <td>{hour.start.format("dd DD.MM.YYYY")}</td>
                <td>{hour.start.format("HH:mm")}</td>
                <td>{hour.end.format("HH:mm")}</td>
                <td>{hour.outOfOffice > 0 && <span>{hour.outOfOffice}&nbsp;min</span>}</td>
                <td>{hour.difference}&nbsp;min</td>
            </tr>
        );

        return (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Out of office</th>
                        <th>Difference</th>
                    </tr>
                </thead>
                <tbody>
                    {listItems}
                </tbody>
            </table>
        );
    }

    _getTotalDifference = hours => _reduce(hours, (result, current) => result + current.difference, 0)

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h2>Current records</h2>
                </div>
                <div className="col-md-12">
                    {this._getHoursList(this.state.hours)}
                </div>
                <div className="col-md-12">
                    <b>Total:</b> {this._getTotalDifference(this.state.hours)}&nbsp;min
                </div>
            </div>
        );
    }
}

export default Summary;