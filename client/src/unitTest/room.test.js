/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import Room  from '../components/Room';
const renderer = require('react-test-renderer');

jest.mock('axios');

// snapshot testings
describe('Test snapshot', () => {
    test('Test Room', () => {
      const component = renderer.create(<Router><Room /></Router>);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
