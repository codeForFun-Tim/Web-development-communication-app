/* eslint-disable jest/valid-expect-in-promise */

    import { 
        getUser,
        addContact,
        deleteContact,
        getSuggestedUsers,
        getSortedUser,
    } from '../javascripts/contact';

import axios from 'axios';
jest.mock('axios');
const fetch = require('jest-fetch-mock');

describe('cotactRequest tests', () => {
    beforeEach(() => {
      fetch.resetMocks();
    });
  
    test('getUser correctly', () => {
        axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
        getUser('test@gmail.com').then(data => {
        expect(data.status).toBe(201);
      })
      .catch(() => {});
    });

    test('addContact correctly', () => {
        axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
        addContact('test@gmail.com', 'new@gmail.com').then(data => {
          expect(data.status).toBe(201);
        })
        .catch(() => {});
      });

      
    test('deleteContact correctly', () => {
        axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
        deleteContact('test@gmail.com').then(data => {
          expect(data.status).toBe(201);
        })
        .catch(() => {});
      });

      
    test('getSuggestedUsers correctly', () => {
        axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
        getSuggestedUsers('test@gmail.com').then(data => {
          expect(data.status).toBe(201);
        })
        .catch(() => {});
      });

      test('getSortedUser correctly', () => {
        axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
        getSortedUser('test@gmail.com').then(data => {
          expect(data.status).toBe(201);
        })
        .catch(() => {});
      });
  });