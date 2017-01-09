import React from 'react';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ThunkMiddleware from 'redux-thunk';
import {mount} from 'enzyme';
import Moment from 'moment';

import FilteredSummary from '../FilteredSummary';
import {TOGGLE_SELECTED_TIME_SHEET} from '../../Actions';

describe('<FilteredSummary />', () => {

    const createMockStore = (...sheets) => {
        return configureMockStore([ThunkMiddleware])({
            timeSheets: sheets || []
        });
    }

    it('can render', () => {
        const store = createMockStore();
        const wrapper = mount(
            <Provider store={store}>
                <FilteredSummary />
            </Provider>
        );
        expect(wrapper).toBeDefined();
    });

    it('can select', () => {
        const key = '1';
        const store = createMockStore({
            key,
            startTime: Moment('2016-10-01 08:00').valueOf(),
            endTime: Moment('2016-10-01 15:00').valueOf(),
        });
        const wrapper = mount(
            <Provider store={store}>
                <FilteredSummary />
            </Provider>
        );
        wrapper.find('tr').at(1).simulate('click');
        expect(store.getActions()[0]).toEqual({type: TOGGLE_SELECTED_TIME_SHEET, key});
    });
});
