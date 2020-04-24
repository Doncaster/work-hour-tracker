import React from 'react';
import Moment from 'moment';
import Input from '../Input';
import Select from '../Input/Select';
import { REPORT_TIMEFRAME_SELECTIONS } from '../../constants';

import './Summary.less';

const timeframeSelections = [{
    name: 'one month',
    value: REPORT_TIMEFRAME_SELECTIONS.ONE_MONTH
}, {
    name: 'six months',
    value: REPORT_TIMEFRAME_SELECTIONS.SIX_MONTHS
}, {
    name: 'custom',
    value: REPORT_TIMEFRAME_SELECTIONS.CUSTOM
}];

const DATE_REGEX = /^\d{4}\/\d{1,2}\/\d{1,2}$/;

const isValid = (value, regex, allowEmpty = false) =>
    allowEmpty ? (!value || regex.test(value)) : regex.test(value);

class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: REPORT_TIMEFRAME_SELECTIONS.ONE_MONTH,
            start: {
                value: null,
                valid: true
            },
            end: {
                value: null,
                valid: true
            }
        };
    }

    _getHoursList = () => {
        const listItems = this.props.timeSheets.map(hour =>
            <tr
                className={hour.selected ? 'active' : ''}
                key={hour.id}
                onClick={() => this.props.onRowClicked(hour.id)}
            >
                <td className="mobile-column">
                    {hour.start.format('dd DD.MM.YYYY')}<br/>
                    {hour.start.format('HH:mm')}-{hour.end.format('HH:mm')}
                </td>
                <td className="non-mobile-column">{hour.start.format('dd DD.MM.YYYY')}</td>
                <td className="non-mobile-column">{hour.start.format('HH:mm')}</td>
                <td className="non-mobile-column">{hour.end.format('HH:mm')}</td>
                <td>{hour.outOfOffice > 0 && <span>{hour.outOfOffice}{' '}min</span>}</td>
                <td>{hour.difference}{' '}min</td>
                <td>{hour.selected &&
                <button type="button" className="close" aria-label="Close" onClick={() => this.props.onRemoveRow(hour.id)}>
                    <span aria-hidden="true">&times;</span>
                </button>}
                </td>
            </tr>
        );

        return (
            <table className='summary-table table table-striped table-hover'>
                <thead>
                <tr>
                    <th className="mobile-column">Time</th>
                    <th className="non-mobile-column">Date</th>
                    <th className="non-mobile-column">Start</th>
                    <th className="non-mobile-column">End</th>
                    <th>Out of office</th>
                    <th colSpan="2">Difference</th>
                </tr>
                </thead>
                <tbody>
                {listItems}
                </tbody>
            </table>
        );
    }

    onSelect = (value) => {
        const { onTimeframeChanged } = this.props;
        this.setState({ selectedValue: value });
        if (value === REPORT_TIMEFRAME_SELECTIONS.ONE_MONTH) {
            onTimeframeChanged(
                Moment().subtract(1, 'months'),
                Moment().endOf('day')
            );
        } else if (value === REPORT_TIMEFRAME_SELECTIONS.SIX_MONTHS) {
            onTimeframeChanged(
                Moment().subtract(6, 'months'),
                Moment().endOf('day')
            );
        }
    }

    onRefresh = () => {
        console.log('on refresh');
        const { onTimeframeChanged } = this.props;
        const { start, end } = this.state;
        onTimeframeChanged(
            Moment(start.value, 'YYYY/M/D'),
            Moment(end.value, 'YYYY/M/D')
        );
    }

    onStartChange = value => {
        this.setState({
            start: {
                value,
                valid: isValid(value, DATE_REGEX)
            }
        });
    }

    onEndChange = value => {
        this.setState({
            end: {
                value,
                valid: isValid(value, DATE_REGEX)
            }
        });
    }

    renderDifference = () => {
        const { totalDifference } = this.props;
        const hours = Math.floor(totalDifference / 60);
        const minutes = totalDifference % 60;
        return hours ? `${hours}h ${minutes}min` : `${minutes}min`;
    }

    render() {
        const { timeSheets } = this.props;
        const { selectedValue, start, end } = this.state;
        return (
            <div className="row">
                <div className='col-md-12'>
                    <h2>Current records</h2>
                    <div>
                        <Select values={timeframeSelections} selected={selectedValue} onSelect={this.onSelect}/>
                        {selectedValue === REPORT_TIMEFRAME_SELECTIONS.CUSTOM && (
                            <div className="row">
                                <Input
                                    type="text"
                                    label="From"
                                    placeHolder="yyyy/mm/dd"
                                    wrapperClass="col-md-4"
                                    onChange={this.onStartChange}
                                    isValid={start.valid}
                                />
                                <Input
                                    type="text"
                                    label="To"
                                    placeHolder="yyyy/mm/dd"
                                    wrapperClass="col-md-4"
                                    onChange={this.onEndChange}
                                    isValid={end.valid}
                                />
                                <div className="col-md-12">
                                    <button
                                        onClick={this.onRefresh}
                                        className="btn btn-default"
                                        disabled={!(start.valid && start.value && end.valid && end.value)}
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                { timeSheets && timeSheets.length
                    ? <div className='col-md-12'>
                          {this._getHoursList()}
                      </div>
                    : <div className='col-md-12'>
                          <h2>
                            <small>No entries...</small>
                          </h2>
                      </div>
                }
                <div className='col-md-12'>
                    <b>Total:</b>
                    {this.renderDifference()}
                </div>
            </div>
        );
    }
}

export default Summary;
