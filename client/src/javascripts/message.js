import { api } from '../api';
import axios from 'axios';

async function sendMessageAPI(msgContent, msgType, msgFrom, msgTo, roomID) {
    const apiUrl = `${api.url}/sendMessage`;
    try {
        const response = await axios.post(apiUrl, {
            text_message_content : msgContent,
            message_type : msgType,
            media_message_content: null,
            from : msgFrom,
            to : msgTo,
            roomID : roomID,
        });
        return response;
    } catch(error) {
        throw new Error(error);
    }
}

async function sendMediaAPI(data) {
    const apiUrl = `${api.url}/sendMessage`;
    console.log(data.get('media_message_content'));
    return axios.post(apiUrl, data); 
}

async function getMessageAPI(msgFrom, msgTo) {
  const apiUrl = `${api.url}/getMessageViaRoom`;
  try {
      const response = await axios.get(apiUrl, 
      {params: {
          from : msgFrom,
          to : msgTo,
      }});
      console.log(response);
      return response;
  } catch(error) {
      throw new Error(error);
  }
}

async function videoCallAPI(username, roomName) {
    const data = await fetch('http://localhost:8080/video/token', {
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