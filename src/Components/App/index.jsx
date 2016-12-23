import React from 'react';
import FirebaseAuth from 'firebase/auth';
import AuthorizedView from '../AuthorizedView';
import UnauthorizedView from '../UnauthorizedView';
import logo from './logo.svg';
import './App.less';
import 'bootstrap/dist/css/bootstrap.min.css'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: null,
            loading: true
        };

    }

    componentWillMount() {
        FirebaseAuth().getRedirectResult().then(result => {
            if (result.user) {
               this.setState({
                   uid: result.user.uid
               });
            }

            this.setState({
                loading: false
            });
        }).catch(error => console.log("error occurred", error));
    }

    render() {
        let content;

        if (this.state.loading) {
            content = <div>Loading...</div>;
        } else {
            content = this.state.uid ? <AuthorizedView uid={this.state.uid}/> : <UnauthorizedView/>;
        }
        return (
            <div className="App ">
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
