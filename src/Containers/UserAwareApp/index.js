import {connect} from 'react-redux';
import App from '../../Components/App';
import {changeView} from '../../Actions';

const mapStateToProps = (state) => {
    return {
        uid: state.uid,
        loading: state.isLoading,
        currentView: state.currentView
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onTabClicked: (view) => {
            dispatch(changeView(view));
        }
    }
}

const userAwareApp = connect(
    mapStateToProps,
    mapDispatchToProps)(App);

export default userAwareApp;