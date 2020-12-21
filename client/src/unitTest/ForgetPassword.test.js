import { validation, ForgetPassword } from '../components/ForgetPassword.js'
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import ReactDOM from 'react-dom';

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
  
    describe('Test functonal component functions', () => {

      let emit;
      let container;
      beforeAll(() => {
        ({ emit } = window._virtualConsole);
      });

      beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        window._virtualConsole.emit = jest.fn();
      });
    
      afterEach(() => {
        document.body.removeChild(container);
        container = null;
      });
    
      test('Test function inside ForgetPassword component', async() => {
        act(() => {
          ReactDOM.render(<Router><ForgetPassword /></Router>, container);
        });
        const loginBtn = container.querySelector('#resetBtn');
        await act(async () => {
          fetch = jest.fn(() => Promise.resolve({ json: () => ({ message: 'success', data: [{ username: 'tester', password: 'tester' }] }) }));
          loginBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        const userName = container.querySelector('#userName');
        expect(userName.value).toBe("");
      });
});