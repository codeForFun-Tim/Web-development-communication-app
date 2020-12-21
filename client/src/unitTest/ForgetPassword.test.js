import { validation, ForgetPassword } from '../components/ForgetPassword.js'
import { BrowserRouter as Router } from 'react-router-dom';
const renderer = require('react-test-renderer');

// snapshot testings
describe('Test snapshot', () => {
    test('Test Login', () => {
      const component = renderer.create(<Router><ForgetPassword /></Router>);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

describe('Independent function tests', () => {
    test('validation function true', () => {
        expect(validation('123456789')).toBe(true);
    });

    test('validation function false', () => {
        expect(validation('1')).toBe(false);
    });
});