
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import OtherProfile from '../components/OtherProfile.js';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));


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
  
    test('Test function inside OtherProfile component', () => {
      act(() => {
        ReactDOM.render(<OtherProfile match={{
            params: {
              param1: 1,
            }
          }}/>, container);
      });
    });
  });
  
