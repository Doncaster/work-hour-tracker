import React from "react";

import FilteredSummary from '../../Containers/FilteredSummary';
import ValidatedReportSheet from '../../Containers/ValidatedReportSheet';

import './AuthorizedView.less';

import {VIEWS} from '../../Constants';

class AuthorizedView extends React.Component {

    _getTabClass = view => this.props.currentView === view ? "active" : null

    _getView = viewName => {
        switch(viewName) {
            case VIEWS.SUMMARY:
                return <FilteredSummary />;
            case VIEWS.REPORT:
                return <ValidatedReportSheet />;
            default:
                return <div>Error occurred</div>;
        }
    }

    render() {
        return (
            <div>
                <ul className="main-tabs">
                    <li className={this._getTabClass(VIEWS.SUMMARY)} onClick={() => this.props.onTabClicked(VIEWS.SUMMARY)}>Summary</li>
                    <li className={this._getTabClass(VIEWS.REPORT)} onClick={() => this.props.onTabClicked(VIEWS.REPORT)}>Report</li>
                </ul>
                <div className="container bottom-padding">
                    {this._getView(this.props.currentView)}
                </div>
            </div>
        );
    }
}

export default AuthorizedView;