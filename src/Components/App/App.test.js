import React from 'react';
import {shallow} from 'enzyme';

import App from '../App';

describe('<App />', () => {
    it('Can render', () => {
        const app = shallow(<App/>);
        expect(app).toBeDefined();
    });

    it('Has unauthorized view', () => {
        const app = shallow(<App/>);
        expect(app.find('UnauthorizedView').length).toEqual(1);
    });

    it('Has authorized view', () => {
        const app = shallow(<App uid="foo"/>);
        expect(app.find('AuthorizedView').length).toEqual(1);
    });
});
