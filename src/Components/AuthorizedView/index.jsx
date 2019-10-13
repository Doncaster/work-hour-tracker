import React from "react";
import _map from 'lodash/map';

import './AuthorizedView.less';

class AuthorizedView extends React.Component {

    render() {
        const views = _map(this.props.views, (view, key) =>
            <li
                key={key}
                className={this.props.currentView === key ? 'active' : null}
                onClick={() => this.props.onTabClicked(key)}>
                {key}
            </li>)
        return (
            <div>
                <button onClick={this.props.onPunch} className="btn btn-default punch-button">Punch</button>
                <ul className="main-tabs">
                    {views}
                </ul>
                <div className="container">
                    {(this.props.currentView && this.props.currentView.length > 0) && React.createElement(this.props.views[this.props.currentView])}
                </div>
            </div>
        );
    }
}

export default AuthorizedView;
