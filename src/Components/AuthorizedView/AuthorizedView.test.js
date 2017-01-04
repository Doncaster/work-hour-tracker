import React from 'react';
import {shallow} from 'enzyme';

import AuthorizedView from '../AuthorizedView';

describe('<AuthorizedView />', () => {
    it('Can render', () => {
        const authorizedView = shallow(<AuthorizedView/>);
        expect(authorizedView).toBeDefined();
    });
});
