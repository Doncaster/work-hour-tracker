import React from 'react';

import './Summary.less';

class Summary extends React.Component {
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

    render() {
        return (
            this.props.timeSheets && this.props.timeSheets.length > 0 ?
                <div className='row'>
                    <div className='col-md-12'>
                        <h2>Current records</h2>
                    </div>
                    <div className='col-md-12'>
                        {this._getHoursList()}
                    </div>
                    <div className='col-md-12'>
                        <b>Total:</b> {this.props.totalDifference}{' '}min
                    </div>
                </div> :
                <div className='row'>
                    <div className='col-md-12'>
                        <h2>
                            <small>No entries...</small>
                        </h2>
                    </div>
                </div>
        );
    }
}

export default Summary;