import React from 'react';
import ReactDOM from 'react-dom';
import {  sortByTime, createImageDiv, createGifDiv, Status } from '../components/Status.js';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderer = require('react-test-renderer');

// snapshot testings
describe('Test snapshot', () => {
  test('Test Status', () => {
    const component = renderer.create(<Status />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Independent function tests', () => {
  test('sortByTime function', () => {
      expect(sortByTime({creationTime: 2}, {creationTime: 1})).toBe(-1);
  });

  test('createImageDiv function', () => {
      const message = {mediaStatus: {data: [1,2,3]}};
      expect(createImageDiv(message)).toBe("data:image/jpeg;base64,AQID");
  });

  test('createGifDiv function', () => {
    const message = {mediaStatus: {data: [1,2,3]}};
      expect(createGifDiv(message)).toBe("data:image/gif;base64,AQID");
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
  
    test('Test function inside Status component', async () => {
      act(() => {
            ReactDOM.render(<Router><Status /></Router>, container);
      });
      const openBtn = container.querySelector('#openBtn');
      //expect(loginBtn).toBe(null);

      act(() => {
        openBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      const textBtn = container.querySelector('#textOption');
      act(() => {
        textBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      const sendBtn = container.querySelector('#sendStatus');
      act(() => {
        sendBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      const imageBtn = container.querySelector('#image-upload');
      await act(async () => {
        window.alert = jest.fn();
        await imageBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
    });

  });