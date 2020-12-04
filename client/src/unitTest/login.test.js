import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Login from "../components/Login.js";
import { BrowserRouter as Router } from 'react-router-dom';

const renderer = require('react-test-renderer');

// snapshot testings
describe('Test snapshot', () => {
  test('Test Login', () => {
    const component = renderer.create(<Router><Login /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// functonal component functions tests
describe('Test functonal component functions', () => {

  let container;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test('Test function inside Login component', () => {
    act(() => {
      ReactDOM.render(<Router><Login /></Router>, container);
    });
    const loginBtn = container.querySelector('#loginBtn');
    act(() => {
      fetch = jest.fn(() => Promise.resolve({ json: () => ({ message: 'success', data: [{ username: 'tester', password: 'tester' }] }) }));
      loginBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const userName = container.querySelector('#userName');
    const password = container.querySelector('#password');
    expect(userName.value).toBe("");
    expect(password.value).toBe("");
  });
});
