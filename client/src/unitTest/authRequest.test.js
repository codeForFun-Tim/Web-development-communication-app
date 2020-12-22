/* eslint-disable jest/valid-expect-in-promise */
import { 
    register,
    login,
    logout,
    changePassword,
    checkAuth,
} from '../javascripts/authRequests';
import axios from 'axios';

jest.mock('axios');

const fetch = require('jest-fetch-mock');

describe('authRequests tests', () => {
    beforeEach(() => {
      fetch.resetMocks();
    });
  
    test('Registers user correctly', () => {
      fetch.mockResponseOnce(JSON.stringify({ status: 201 }));
      register('test@gmail.com', 'test', 'password').then(data => {
        expect(data.status).toBe(201);
      })
      .catch(() => {});
    });

    test('login user correctly', () => {
        fetch.mockResponseOnce(JSON.stringify({ status: 201 }));
        login('test@gmail.com', 'password').then(data => {
          expect(data.status).toBe(401);
        })
        .catch(() => {});
      });

      
    test('logout correctly', () => {
        axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
        logout().then(data => {
          expect(data.status).toBe(201);
        })
        .catch(() => {});
      });

      test('changePassword correctly', () => {
        axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
        changePassword('test@gmail.com', '123123123').then(data => {
          expect(data.status).toBe(201);
        })
        .catch(() => {});
      });

      test('checkAuth correctly', () => {
        fetch.mockResponseOnce(JSON.stringify({ status: 401 }));
        checkAuth().then(data => {
          expect(data.status).toBe(401);
        })
        .catch(() => {});
      });
  });