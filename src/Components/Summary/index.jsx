import React from 'react';

class Summary extends React.Component {
    _getHoursList = () => {
        const listItems = this.props.timeSheets.map(hour =>
            <tr
                className={hour.selected ? 'active' : ''}
                key={hour.id}
                onClick={() => this.props.onRowClicked(hour.id)}
            >
                <td>{hour.start.format('dd DD.MM.YYYY')}</td>
                <td>{hour.start.format('HH:mm')}</td>
                <td>{hour.end.format('HH:mm')}</td>
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
            <table className='table table-striped table-hover'>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Start</th>
                    <th>End</th>
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