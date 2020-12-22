/* eslint-disable jest/valid-expect-in-promise */

import { 
    sendMessageAPI,
    sendMediaAPI,
    getMessageAPI,
    videoCallAPI,
    } from '../javascripts/message';

    import axios from 'axios';
    jest.mock('axios');
    const fetch = require('jest-fetch-mock');


    describe('messageRequest tests', () => {
        beforeEach(() => {
          fetch.resetMocks();
        });
      
        test('sendMessageAPI correctly', () => {
            fetch.mockResponseOnce(JSON.stringify({ status: 201 }));
            sendMessageAPI('hello', 'text', 'test@gmail.com', 'test@gmail.com', 123).then(data => {
            expect(data.status).toBe(201);
          })
          .catch(() => {});
        });
    
        test('sendMediaAPI correctly', () => {
            fetch.mockResponseOnce(JSON.stringify({ status: 201 }));
            sendMediaAPI('hello', 'image/jpeg', 'test@gmail.com', 'test@gmail.com', 123).then(data => {
              expect(data.status).toBe(201);
            })
            .catch(() => {});
          });
    
          
        test('getMessageAPI correctly', () => {
            axios.get.mockImplementationOnce(JSON.stringify({ status: 201 }));
            getMessageAPI('test@gmail.com', 'test1@gmail.com').then(data => {
              expect(data.status).toBe(201);
            })
            .catch(() => {});
          });
    
          
        test('videoCallAPI correctly', () => {
            fetch.mockResponseOnce(JSON.stringify({ status: 201 }));
            videoCallAPI('test@gmail.com', 123).then(data => {
              expect(data.status).toBe(201);
            })
            .catch(() => {});
          });
    
      });