import React from "react";
import Input from '../Input';
import Radio from '../Input/Radio';

class ReportSheet extends React.Component {

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h3>Report new hours</h3>
                </div>
                <Input {...this.props.dateField} />
                <Input {...this.props.startTimeField} />
                <Input {...this.props.endTimeField} />
                <Input {...this.props.oooField} />
                <Radio {...this.props.workingDayField} />
                <div className="col-md-12">
                    <button className="btn btn-default" onClick={this.props.onSubmit} disabled={!this.props.submitEnabled}>Save</button>
                </div>
            </div>
        );
    }
}

export default ReportSheet;
