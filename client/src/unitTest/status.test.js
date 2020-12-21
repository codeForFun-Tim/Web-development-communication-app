import React from 'react';
import ReactDOM from 'react-dom';
import Status from '../components/Status.js';
import { act } from 'react-dom/test-utils';
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

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
      localStorage.setItem('curr_user', 'newlion@gmail.com');
      act(() => {
            ReactDOM.render(<Status />, container);
      });
      localStorage.clear();
    });

  });