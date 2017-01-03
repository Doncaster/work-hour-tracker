import React from 'react';
import {shallow} from 'enzyme';

import App from '../App';

describe('<App />', () => {
    it('Can render', () => {
        const app = shallow(<App/>);
        expect(app).toBeDefined();
    })
});
