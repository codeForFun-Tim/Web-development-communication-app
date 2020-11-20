import React from 'react';
import NaviBar from '../components/NaviBar.js';

const renderer = require('react-test-renderer');

// snapshot testings
describe('Test snapshot', () => {
  test('Test Profile', () => {
    const component = renderer.create(<NaviBar />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
