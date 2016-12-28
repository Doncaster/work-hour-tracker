import React from 'react';

import AuthorizedView from '../AuthorizedView';
import UnauthorizedView from '../UnauthorizedView';
import LoadingSpinner from '../LoadingSpinner';

import logo from './logo.svg';
import './App.less';

import 'bootstrap/dist/css/bootstrap.min.css'

class App extends React.Component {

    render() {
        const content = this.props.uid ? <AuthorizedView uid={this.props.uid}/> : <UnauthorizedView/>;

        return (
            <div className="App">
                <LoadingSpinner visible={this.props.loading} />
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Work hour tracker</h2>
                </div>
                {content}
            </div>
        );
    }
}

export default App;
