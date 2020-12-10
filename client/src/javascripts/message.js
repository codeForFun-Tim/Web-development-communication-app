import { api } from '../api';
import axios from 'axios';

async function sendMessageAPI(msgContent, msgType, msgFrom, msgTo, roomID) {
    const apiUrl = `${api.url}/sendMessage`;
    try {
        const response = await axios.post(apiUrl, {
            text_message_content : msgContent,
            message_type : msgType,
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


export {
    sendMessageAPI,
    sendMediaAPI,
  };