/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';

import ChatView from '../components/ChatView';

describe('Test All ChatView Functions', () => {
    test('render HTML', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        act(() => {
          ReactDOM.render(<ChatView />, container);
        });
        const ul = document.getElementById('myul');
        const chat = document.getElementById('chat');
        const btus = document.getElementById('btu_div');
        const textarea = document.getElementById('textarea');
        const youmessage = document.getElementsByClassName('you')
        expect(ul).not.toBe(null);
        expect(chat).not.toBe(null);
        expect(btus).not.toBe(null);
        expect(textarea).not.toBe(null);
        expect(youmessage).not.toBe(null);
      });

    test('search contacts name', () => {
      const ul = document.getElementById('myul');

      const input = document.getElementById('myInput');
      input.value = 'x';
      act(() => {
        Simulate.change(input);
        Simulate.keyUp(input, {keyCode: 67});
      });
      const list = ul.getElementsByTagName('li');
      expect(list[0].style.display).toBe("none");
    });

    test('click contacts name', () => {
        const ul = document.getElementById('myul');
        const li = ul.getElementsByTagName('li');

        act(() => {
            // Simulate.click(li[0]);
            li[0].click()
        });
        const title = document.getElementById('chat_title').innerHTML;
        expect(title).toBe('cat@gmail.com');

        act(() => {
            // Simulate.click(li[1]);
            li[1].click()
        });
        const title2 = document.getElementById('chat_title').innerHTML;
        expect(title2).toBe('dog@gmail.com');

        act(() => {
            // Simulate.click(li[2]);
            li[2].click()
        });
        const title3 = document.getElementById('chat_title').innerHTML;
        expect(title3).toBe('dog');
    });

    test('send message',() => {
        const textarea = document.getElementById('textarea');
        textarea.value = 'test';
        const btu = document.getElementById('submitbtu')
        const mymessage = document.getElementsByClassName('me')
        act(() => {
            Simulate.change(textarea);
            Simulate.click(btu);
        });
        expect(mymessage).not.toBe(null);
    });

    test('click Record Audio',() => {
        const btu = document.getElementById('recordAudio');
        const popup = document.getElementById('popup1')
        const stopRecord = document.getElementById('stopRecord');
        act(() => {
            Simulate.click(btu);
        });
        expect(popup.style.visibility).toBe('visible');
        expect(stopRecord.style.visibility).toBe('hidden');
    });

    test('close popup window',() => {
        const btu = document.getElementById('closepop');
        const popup = document.getElementById('popup1')
        const recordedAudio = document.getElementById('recordedAudio');
        act(() => {
            Simulate.click(btu);
        });
        expect(popup.style.visibility).toBe('hidden');
        expect(recordedAudio.src).toBe('http://localhost/');
    });

    test('delete user from contact list', () => {
        const btu = document.getElementById('deleteUser');
        const li = document.getElementById('1');
        // const currentTitle = li.value;
        act(() => {
            li.click()
            btu.click()
        });
        const title = document.getElementById('chat_title').innerHTML;
        expect(title).toBe("pig");
    });
  });