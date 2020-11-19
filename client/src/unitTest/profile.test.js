import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Profile from '../components/Profile.js';

const renderer = require('react-test-renderer');

// snapshot testings
describe('Test snapshot', () => {
  test('Test Profile', () => {
    const component = renderer.create(<Profile />);
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
      ReactDOM.render(<Profile />, container);
    });
  });

});
