/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import Participant  from '../components/Participant';
const renderer = require('react-test-renderer');

jest.mock('axios');

// snapshot testings
describe('Test snapshot', () => {
    test('Test Participant', () => {
      const component = renderer.create(<Router><Participant participant={{
        params: {
          param1: 'test',
        }
      }}/></Router>);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
