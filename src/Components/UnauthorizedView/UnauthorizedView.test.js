import React from 'react';
import {shallow} from 'enzyme';
import Firebase from 'firebase';

import UnauthorizedView from '../UnauthorizedView';

describe('<UnauthorizedView />', () => {
    var login;

    beforeEach(() => {
        login = jasmine.createSpy('login');
        spyOn(Firebase.auth, 'GoogleAuthProvider');
        spyOn(Firebase, 'auth').and.callFake(() => {
            return {
                signInWithRedirect: login
            }
        });
    });

    it('Can render', () => {
        const unauthorizedView = shallow(<UnauthorizedView/>);
        expect(unauthorizedView).toBeDefined();
    });

    it('Can click login', () => {
        const unauthorizedView = shallow(<UnauthorizedView/>);
        unauthorizedView.find('button').simulate('click');
        expect(login).toHaveBeenCalled();
    });
});
