import React from "react";
import FirebaseDB from 'firebase/database';
import Moment from 'moment';
import ValidatableInput from '../ValidatableInput';

import './ReportSheet.less';

const FORMATS = {
    DATE: {
        PLACEHOLDER: "yyyy/mm/dd",
        FORMAT: "YYYY/M/D",
        REGEX: /^\d{4}\/\d{1,2}\/\d{1,2}$/
    },
    TIME: {
        PLACEHOLDER: "hh:mm",
        FORMAT: "H:mm",
        REGEX: /^\d{1,2}:\d{2}$/
    }
};

class ReportSheet extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            submitDisabled: true,
            isWorkingDay: null,
            date: "",
            endTime: "",
            startTime: ""
        };
    }

    componentWillMount() {
        this.workingHoursRef = FirebaseDB().ref("hours/" + this.props.uid);
    }

    componentWillUnmount() {
        this.workingHoursRef.off();
    }

    _onSubmit = () => {
        const startTime = new Moment(`${this.state.date} ${this.state.startTime}`, `${FORMATS.DATE.FORMAT} ${FORMATS.TIME.FORMAT}`);
        const endTime = new Moment(`${this.state.date} ${this.state.endTime}`, `${FORMATS.DATE.FORMAT} ${FORMATS.TIME.FORMAT}`);

        this.workingHoursRef.push().set({
            startTime: startTime.valueOf(),
            endTime: endTime.valueOf(),
            outOfOffice: Number.isNaN(this.oooField.value) ? null : Number(this.oooField.value),
            target: this.state.isWorkingDay ? 7.5 : 0
        });

        this.oooField.value = null;

        this.setState({
            submitDisabled: true,
            isWorkingDay: null,
            date: "",
            endTime: "",
            startTime: ""
        });
    }

    _onFieldChanged = () => {
        this.setState({
            submitDisabled: !this.state.date || !this.state.startTime|| !this.state.endTime || this.state.isWorkingDay === null
        });
    }

    _onWorkingDayChanged = event => {
        this.setState({
            isWorkingDay: event.target.value === "true" ? true : false
        }, this._onFieldChanged);
    }

    _getChangeHandlerFor = fieldName => value => {
        const newState = {};
        newState[fieldName] = value;
        this.setState(newState, this._onFieldChanged);
    }

    _regexValidatorFor = regex => value => regex.test(value)

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h3>Report new hours</h3>
                </div>
                <ValidatableInput
                    type="text"
                    label="Date"
                    placeHolder={FORMATS.DATE.PLACEHOLDER}
                    wrapperClass="col-md-4"
                    validator={this._regexValidatorFor(FORMATS.DATE.REGEX)}
                    onChange={this._getChangeHandlerFor("date")}
                    value={this.state.date}
                />
                <ValidatableInput
                    type="text"
                    label="Start time"
                    placeHolder={FORMATS.TIME.PLACEHOLDER}
                    wrapperClass="col-md-4"
                    validator={this._regexValidatorFor(FORMATS.TIME.REGEX)}
                    onChange={this._getChangeHandlerFor("startTime")}
                    value={this.state.startTime}
                />
                <ValidatableInput
                    type="text"
                    label="End time"
                    placeHolder={FORMATS.TIME.PLACEHOLDER}
                    wrapperClass="col-md-4"
                    validator={this._regexValidatorFor(FORMATS.TIME.REGEX)}
                    onChange={this._getChangeHandlerFor("endTime")}
                    value={this.state.endTime}
                />
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="oooField">Out of office</label>
                        <input
                            id="oooField"
                            className="form-control"
                            ref={ref => this.oooField = ref}
                            type="number"
                            placeholder="e.g. 0,5"/>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group form-working-day-field">
                        <label>Working day</label><br/>
                        <label className="radio-inline">
                            <input type="radio" name="workingDay" value="true" onChange={this._onWorkingDayChanged} checked={this.state.isWorkingDay === true} /> true
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="workingDay" value="false" onChange={this._onWorkingDayChanged} checked={this.state.isWorkingDay === false} /> false
                        </label>
                    </div>
                </div>
                <div className="col-md-12">
                    <button className="btn btn-default" onClick={this._onSubmit} disabled={this.state.submitDisabled}>Save</button>
                </div>
            </div>
        );
    }
}

export default ReportSheet;
