import React from "react";
import _map from 'lodash/map';

import './AuthorizedView.less';

class AuthorizedView extends React.Component {

    render() {
        const views = _map(this.props.views, (view, key) =>
            <li className={this.props.currentView === key ? 'active' : null} onClick={() => this.props.onTabClicked(key)}>{key}</li>)
        return (
            <div>
                <ul className="main-tabs">
                    {views}
                </ul>
                <div className="container bottom-padding">
                    {React.createElement(this.props.views[this.props.currentView])}
                </div>
            </div>
        );
    }
}

export default AuthorizedView;