import { api } from '../api';
import axios from 'axios';


async function addTextStatus(currentUser, text) {
    // eslint-disable-next-line no-undef
    const apiUrl = `${api.url}/sendStatus`;
    const formData = new FormData();
    formData.append('currentUser', currentUser)
    formData.append('statusType', 'text');
    formData.append('text_status_content', text);
    return axios.post(apiUrl, formData); 
}

async function addMediaStatus(currentUser, image) {
    // eslint-disable-next-line no-undef
    const apiUrl = `${api.url}/sendStatus`;
    const formData = new FormData();
    formData.append('currentUser', currentUser)
    formData.append('statusType', image.type);
    formData.append('media_status_content', image);
    return axios.post(apiUrl, formData); 
}

async function getFeed(logUser) {
    const apiUrl = `${api.url}/getStatus`;
    return axios.get(apiUrl, 
        {params: {
            logUser : logUser,
        }});
}

async function viewedStatus(viewer, statusId) {
    // eslint-disable-next-line no-undef
    const apiUrl = `${api.url}/viewStatus`;
    const formData = new FormData();
    formData.append('viewer', viewer);
    formData.append('statusId', statusId);
    //console.log(viewer, statusId);
    return axios.post(apiUrl, formData); 
}

export {
    addTextStatus,
    addMediaStatus,
    getFeed,
    viewedStatus,
  };
