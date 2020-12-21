import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {Profile, validation} from '../components/Profile.js';

const renderer = require('react-test-renderer');

describe('Independent function tests', () => {
    test('validation function true', () => {
        expect(validation('123456789')).toBe(true);
    });

    test('validation function false', () => {
        expect(validation('1')).toBe(false);
    });
});

// snapshot testings
describe('Test snapshot', () => {
  test('snapshot', () => {
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

  test('Test function inside profile component', () => {
    act(() => {
      ReactDOM.render(<Profile />, container);
    });
  });

});
