import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router-dom';
import Register from "../components/Register.js";

const renderer = require('react-test-renderer');

// snapshot testings
describe('Test snapshot', () => {
  test('Test Login', () => {
    const component = renderer.create(<Register />);
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
  
    test('Test function inside Register component', () => {
      act(() => {
            ReactDOM.render(<Register />, container);
      });
      const submitBtn = container.querySelector('#submitBtn');
      act(() => {
        fetch = jest.fn(() => Promise.resolve({ json: () => ({ message: 'success', data: [{ username: 'tester', password: 'tester' }] }) }));
        submitBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      const userName = container.querySelector('#userName');
      const nickName = container.querySelector('#nickName');
      const password = container.querySelector('#password');
      expect(userName.value).toBe("");
      expect(nickName.value).toBe("");
      expect(password.value).toBe("");
    });
  
    test('Test function inside Login component failure', async() => {
        act(() => {
          ReactDOM.render(<Register />, container);
        });
        const submitBtn = container.querySelector('#submitBtn');
        await act(async () => {
          fetch = jest.fn(() => Promise.reject({ json: () => ({ message: 'failed', data: { player: 'tester', point: 2, id: 1 }})}));
          submitBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
      });
  });
  
