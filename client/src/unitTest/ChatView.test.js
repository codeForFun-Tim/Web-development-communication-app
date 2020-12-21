/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import {ChatView, array_move, sortByTime, sortByLatestTime, createImageDiv, createAudioDiv, createVideoDiv, generateRoomID, putHistoryMsg} from '../components/ChatView';
const renderer = require('react-test-renderer');

jest.mock('axios');

// snapshot testings
describe('Test snapshot', () => {
    test('Test Login', () => {
      const component = renderer.create(<Router><ChatView /></Router>);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });


describe('Independent function tests', () => {
    test('array_move function', () => {
      expect(array_move([1,2,3], 0, 1)[0]).toBe(2);
    });

    test('sortByTime function', () => {
        expect(sortByTime({time: 2}, {time: 1})).toBe(1);
    });

    test('sortByLatestTime function', () => {
      expect(sortByLatestTime({time: 1}, {time: 2})).toBe(NaN);
    });

    test('createImageDiv function', () => {
        expect(createImageDiv({content: {data: 'test'}})).toBe("<img width=\"320\" height=\"240\" src=data:image/jpeg;base64, alt=\"The picture is gone.\">");
    });

    test('createAudioDiv function', () => {
        expect(createAudioDiv({content: {data: 'test'}})).toBe("<audio controls><source src=data:audio/mpeg;base64, type=\"audio/mpeg\">Your browser does not support the audio element.</audio>");
    });

    test('createVideoDiv function', () => {
        expect(createVideoDiv({content: {data: 'test'}})).toBe("<video width=\"320\" height=\"240\" controls><source src=data:video/mp4;base64, type=\"video/mp4\">Your browser does not support the video tag.</video>");
    });

    test('generateRoomID function', () => {
        expect(generateRoomID('test1', 'test2')).toBe('test2test1');
    });
});

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

    test('click add contact', () => {
        const addbtu = document.getElementById('addUser');
        act(() => {
            addbtu.click();
        });
        const popup3 = document.getElementById('popup3');
        expect(popup3.style.visibility).toBe("visible");
    });

    test('click suggest user btu', () => {
        const dropdownbtu = document.getElementById('addsuggest');
        act(() => {
            dropdownbtu.click();
        });
        const mydropdown = document.getElementById('myDropdown');
        expect(mydropdown.className).toBe('dropdown-content show');
    });

    test('close suggest user dropdown', () => {
        const otherbtu = document.getElementById('add_contact_input');
        act(() => {
            otherbtu.click();
        });
        const mydropdown = document.getElementById('myDropdown');
        expect(mydropdown.className).toBe('dropdown-content');
    });

    test('add a contact', () => {
        const input = document.getElementById('add_contact_input');
        input.value = 'test1@gmail.com';
        const submitbtu = document.getElementById('add_contact_submit');
        act(() => {
            Simulate.change(input);
            submitbtu.click();
        });
        const ul = document.getElementById('myul');
        const list = ul.getElementsByTagName('li');
        expect(list.length).toBe(0);
    });

    test('close add contact window', () => {
        const closebtu = document.getElementById('closepop3');
        act(() => {
            closebtu.click();
        });
        const popup3 = document.getElementById('popup3');
        expect(popup3.style.visibility).toBe("hidden");
    });
    

    test('search contacts name', () => {
        const ul = document.getElementById('myul');
        const li = document.createElement('li');
        const h2 = document.createElement('h2');
        li.value = "test@gmail.com";
        li.id = "test@gmail.com";
        //li.onclick = function(e) {event_handler(e, 'value')};
        h2.innerHTML = "test@gmail.com";
        li.appendChild(h2);
        ul.appendChild(li);
        const input = document.getElementById('myInput');
        input.value = 'x';
        act(() => {
            Simulate.change(input);
            Simulate.keyUp(input, {keyCode: 67});
        });
        const list = ul.getElementsByTagName('li');
        expect(list[0].style.display).toBe("none");
    });

    // test('click contacts name', () => {
    //     const ul = document.getElementById('myul');
    //     const li = ul.getElementsByTagName('li');
    //     console.log(li);
    //     act(() => {
    //         // Simulate.click(li[0]);
    //         li[0].click()
    //     });
    //     const title = document.getElementById('chat_title').innerHTML;
    //     expect(title).not.toBe(null);

    //     act(() => {
    //         // Simulate.click(li[1]);
    //         li[1].click()
    //     });
    //     const title2 = document.getElementById('chat_title').innerHTML;
    //     expect(title2).toBe('dog@gmail.com');

    //     act(() => {
    //         // Simulate.click(li[2]);
    //         li[2].click()
    //     });
    //     const title3 = document.getElementById('chat_title').innerHTML;
    //     expect(title3).toBe('guangzhe@test.com');
    // });

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

    // test('click Record Audio - start',() => {
    //     const startbtu = document.getElementById('startRecord');
    //     act(() => {
    //         Simulate.click(startbtu);
    //     });
    //     const stopbtu = document.getElementById('stopRecord');
    //     expect(stopbtu.style.visibility).toBe('visible');
    // });

    // test('click Record Audio - stop',() => {
    //     const stopbtu = document.getElementById('stopRecord');
    //     act(() => {
    //         Simulate.click(stopbtu);
    //     });
    //     const startbtu = document.getElementById('startRecord');
    //     const sendbtu = document.getElementById('sendRecord');
    //     const recordaudio = document.getElementById('recordedAudio');
    //     expect(startbtu.style.visibility).toBe('visible');
    //     expect(sendbtu.style.visibility).toBe('visible');
    //     expect(recordaudio).not.toBe(null);
    // });

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
        // const currentTitle = li.value;
        act(() => {
            btu.click()
        });
        const title = document.getElementById('chat_title').innerHTML;
        expect(title).toBe("No Contacts");
    });

    test('click Video Call',() => {
        const btu = document.getElementById('invite_video');
        act(() => {
            Simulate.click(btu);
        });
        const msg_decl_btu = document.getElementById('decline_call');
        const msg_accp_btu = document.getElementById('accept_call');
        expect(msg_decl_btu).not.toBe(null);
        expect(msg_accp_btu).not.toBe(null);
    });

    test('click Decline Button',() => {
        const btu = document.getElementById('decline_call');
        act(() => {
            Simulate.click(btu);
        });
        const popup = document.getElementById('popup2')
        expect(popup.style.visibility).toBe('');
    });

    test('close popup window 2',() => {
        const btu = document.getElementById('closepop2');
        act(() => {
            Simulate.click(btu);
        });
        const popup = document.getElementById('popup2')
        const yes_decline_btu = document.getElementById('yes_decline');
        const msg_decl_btu = document.getElementById('decline_call');
        const msg_accp_btu = document.getElementById('accept_call');
        expect(popup.style.visibility).toBe('hidden');
        expect(yes_decline_btu.style.visibility).toBe('hidden');
        expect(msg_decl_btu).not.toBe(null);
        expect(msg_accp_btu).not.toBe(null);
    });

    // test('click decline yes button',() => {
    //     const btu1 = document.getElementById('decline_call');
    //     const btu2 = document.getElementById('yes_decline');
    //     act(() => {
    //         Simulate.click(btu1);
    //         Simulate.click(btu2);
    //     });
    //     const popup = document.getElementById('popup2')
    //     const yes_decline_btu = document.getElementById('yes_decline');
    //     const msg_decl_btu = document.getElementById('decline_call');
    //     const msg_accp_btu = document.getElementById('accept_call');
    //     const callflag = document.getElementsByClassName('callFlag');
    //     expect(popup.style.visibility).toBe('hidden');
    //     expect(yes_decline_btu.style.visibility).toBe('hidden');
    //     expect(callflag[callflag.length-1].innerHTML).toBe('Call Ended');
    //     expect(msg_decl_btu).toBe(null);
    //     expect(msg_accp_btu).toBe(null);
    // });

    // test('putHistoryMsg function from test', () => {
    //     putHistoryMsg('test', 'test', {time:'1', type:'text', content:'teststring'});
    //     const msgelements = document.getElementsByClassName('test');
    //     expect(msgelements.length).toBe(1);
    // });

    // test('putHistoryMsg function from me', () => {
    //     putHistoryMsg('me', 'me', {time:'1', type:'text', content:'teststring'});
    //     const spanlements = document.getElementsByClassName('delieverednotice');
    //     expect(spanlements[0].innerHTML).toBe('Delievered');
    // });
    
  });
