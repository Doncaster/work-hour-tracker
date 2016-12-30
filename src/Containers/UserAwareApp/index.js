import {connect} from 'react-redux';
import App from '../../Components/App';
import {changeView} from '../../Actions';
import FilteredSummary from '../FilteredSummary';
import ValidatedReportSheet from '../ValidatedReportSheet';

const mapStateToProps = (state) => {
    return {
        uid: state.uid,
        loading: state.isLoading,
        currentView: state.currentView || 'Summary',
        views: {
            Summary: FilteredSummary,
            Report: ValidatedReportSheet
        }
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