import { api } from '../api';
import axios from 'axios';

async function sendMessageAPI(msgContent, msgType, msgFrom, msgTo, roomID) {
    const apiUrl = `${api.url}/sendMessage`;
    const formData = new FormData();
    formData.append('text_message_content', msgContent);
    formData.append('message_type', msgType);
    formData.append('media_message_content', null);
    formData.append('from', msgFrom);
    formData.append('to', msgTo);
    formData.append('roomID', roomID);

    return fetch(apiUrl,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
      mode: 'cors',
    });
}

async function sendMediaAPI(data) {
    const apiUrl = `${api.url}/sendMessage`;
    console.log(data.get('media_message_content'));
    return fetch(apiUrl,
      {
        method: 'POST',
        body: data,
        credentials: 'include',
        mode: 'cors',
      });
}

async function getMessageAPI(msgFrom, msgTo) {
  const apiUrl = `${api.url}/getMessageViaRoom`;
    return axios.get(apiUrl, 
      {params: {
          from : msgFrom,
          to : msgTo,
      }},
      {
        withCredentials: true
      });
} 


async function videoCallAPI(username, roomName) {
    const data = await fetch(`${api.url}/video/token`, {
      method: 'POST',
      body: JSON.stringify({
        identity: username,
        room: roomName
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
    return Promise.resolve(data);
}


export {
    sendMessageAPI,
    sendMediaAPI,
    getMessageAPI,
    videoCallAPI,
  };