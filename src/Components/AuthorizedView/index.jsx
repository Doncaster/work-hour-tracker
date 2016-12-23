import React from "react";

import Summary from '../Summary';
import ReportSheet from '../ReportSheet';

import './AuthorizedView.less';

const SUMMARY_VIEW = "SUMMARY";
const REPORT_VIEW = "REPORT";

class AuthorizedView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            view: SUMMARY_VIEW
        };
    }

    _show = view => this.setState({view})

    _getTabClickHandlerFor = view => {
        return () => this.setState({view});
    }

    _getTabClass = view => this.state.view === view ? "active" : null

    _getView = viewName => {
        switch(viewName) {
            case SUMMARY_VIEW:
                return <Summary {...this.props} />;
            case REPORT_VIEW:
                return <ReportSheet {...this.props} />;
            default:
                return <div>Error occurred</div>;
        }
    }

    render() {
        return (
            <div>
                <ul className="main-tabs">
                    <li className={this._getTabClass(SUMMARY_VIEW)} onClick={this._getTabClickHandlerFor(SUMMARY_VIEW)}>Summary</li>
                    <li className={this._getTabClass(REPORT_VIEW)} onClick={this._getTabClickHandlerFor(REPORT_VIEW)}>Report</li>
                </ul>
                <div className="container">
                    {this._getView(this.state.view)}
                </div>
            </div>
        );
    }
}

export default AuthorizedView;