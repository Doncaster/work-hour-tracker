import {connect} from 'react-redux';
import App from '../../Components/App';

const mapStateToProps = (state) => {
    return {
        uid: state.uid,
        loading: state.isLoading
    }
}

const userAwareApp = connect(mapStateToProps)(App);

export default userAwareApp;