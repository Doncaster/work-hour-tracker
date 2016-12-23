import React from "react";
import FirebaseAuth from 'firebase/auth';
import './UnauthorizedView.less';

class UnauthorizedView extends React.Component {

    _onLogin = () => {
        FirebaseAuth().signInWithRedirect(new FirebaseAuth.GoogleAuthProvider());
    }

    render() {
        return (
            <div className="unauthorized-view--content">
                <div>
                    <p className="App-intro">
                        Please log in to continue.
                    </p>
                    <p className="App-intro">
                        <button className="btn btn-default" onClick={this._onLogin}>Login</button>
                    </p>
                </div>
            </div>
        );
    }
}

export default UnauthorizedView;