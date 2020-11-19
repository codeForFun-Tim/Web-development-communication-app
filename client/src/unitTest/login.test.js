import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Login from "../components/Login.js";

const renderer = require('react-test-renderer');

// snapshot testings
describe('Test snapshot', () => {
  test('Test Login', () => {
    const component = renderer.create(<Login />);
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
      ReactDOM.render(<Login />, container);
    });
    const loginBtn = container.querySelector('#loginBtn');
    act(() => {
      fetch = jest.fn(() => Promise.resolve({ json: () => ({ message: 'success', data: [{ username: 'tester', password: 'tester' }] }) }));
      loginBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const userName = container.querySelector('#userName');
    const password = container.querySelector('#userName');
    expect(userName.value).toBe("");
    expect(password.value).toBe("");
  });

  test('Test function inside Login component failure', async() => {
    act(() => {
      ReactDOM.render(<Login />, container);
    });
    const loginBtn = container.querySelector('#loginBtn');
    await act(async () => {
      fetch = jest.fn(() => Promise.reject({ json: () => ({ message: 'failed', data: { player: 'tester', point: 2, id: 1 }})}));
      loginBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  });
});
