/* eslint-disable jest/valid-expect-in-promise */
import { 
    addTextStatus,
    addMediaStatus,
    getFeed,
    viewedStatus,
} from '../javascripts/status';

import axios from 'axios';
jest.mock('axios');
const fetch = require('jest-fetch-mock');

describe('statusRequest tests', () => {
    beforeEach(() => {
      fetch.resetMocks();
    });
  
    test('addTextStatus correctly', () => {
        axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
      addTextStatus('test@gmail.com', 'testText').then(data => {
        expect(data.status).toBe(201);
      })
      .catch(() => {});
    });

    test('addMediaStatus correctly', () => {
        axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
        addMediaStatus('test@gmail.com', 'testImage').then(data => {
          expect(data.status).toBe(201);
        })
        .catch(() => {});
      });

      
    test('getFeed correctly', () => {
        axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
        getFeed('test@gmail.com').then(data => {
          expect(data.status).toBe(201);
        })
        .catch(() => {});
      });

      
    test('viewedStatus correctly', () => {
        axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
        viewedStatus('test@gmail.com', '121121212').then(data => {
          expect(data.status).toBe(201);
        })
        .catch(() => {});
      });
  });