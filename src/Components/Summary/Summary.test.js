import React from 'react';
import {shallow} from 'enzyme';
import Moment from 'moment';

import Summary from '../Summary';

describe('<Summary />', () => {
    let timeSheets;

    beforeEach(() => {
        timeSheets = [{
            id: 1,
            start: Moment('2016-10-10 08:00:00'),
            end: Moment('2016-10-10 10:00:00'),
            outOfOffice: 30,
            difference: 30
        },{
            id: 2,
            start: Moment('2016-10-11 09:00:00'),
            end: Moment('2016-10-10 11:00:00'),
            outOfOffice: 0,
            difference: 60
        }];
    });

    it('Can render', () => {
        const summary = shallow(<Summary />);
        expect(summary).toBeDefined();
    });

    it('Can render rows', () => {
        const props = {
            timeSheets,
            totalDifference: 30
        };
        const summary = shallow(<Summary {...props} />);
        expect(summary.find('tr').length).toEqual(3);
    });

    it('Can select row', () => {
        const onRowClicked = jasmine.createSpy('onRowClicked');

        const props = {
            timeSheets,
            totalDifference: 30,
            onRowClicked
        };
        const summary = shallow(<Summary {...props} />);
        summary.find('tr').at(1).simulate('click');

        expect(onRowClicked).toHaveBeenCalledWith(1);
    });

    it('Can remove row', () => {
        const onRemoveRow = jasmine.createSpy('onRemoveRow');

        const props = {
            timeSheets,
            totalDifference: 30,
            onRemoveRow
        };
        props.timeSheets[1].selected = true;

        const summary = shallow(<Summary {...props} />);
        summary.find('button').simulate('click');

        expect(onRemoveRow).toHaveBeenCalledWith(2);
    })
});
