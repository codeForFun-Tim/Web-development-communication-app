import React from 'react';
import MainPage from '../components/mainPage.js';

const renderer = require('react-test-renderer');

// snapshot testings
describe('Test snapshot', () => {
  test('Test Profile', () => {
    const component = renderer.create(<MainPage />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});