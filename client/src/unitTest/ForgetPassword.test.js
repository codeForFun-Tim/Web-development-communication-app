import {validation} from '../components/ForgetPassword.js'

describe('Independent function tests', () => {
    test('validation function true', () => {
        expect(validation('123456789')).toBe(true);
    });

    test('validation function false', () => {
        expect(validation('1')).toBe(false);
    });
});