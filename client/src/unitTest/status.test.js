import React from 'react';
import ReactDOM from 'react-dom';
import Status from '../components/Status.js';
import { act } from 'react-dom/test-utils';

const renderer = require('react-test-renderer');

// snapshot testings
describe('Test snapshot', () => {
  test('Test Profile', () => {
    const component = renderer.create(<Status />);
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
  
    test('Test function inside Status component', () => {
      act(() => {
            ReactDOM.render(<Status />, container);
      });
      const submitBtn = container.querySelector('#btn0');
      act(() => {
        fetch = jest.fn(() => Promise.resolve({ json: () => ({ message: 'success', data: [{ username: 'tester', password: 'tester' }] }) }));
        submitBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });


    });

  });