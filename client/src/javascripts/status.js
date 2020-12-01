import { api } from '../api';
import axios from 'axios';


async function addStatus(text, image, creationTime) {
    // eslint-disable-next-line no-undef
    /**
    const formData = new FormData();
    formData.append('text', text);
    formData.append('image', image);
    formData.append('creationTime', creationTime);

    return fetch(`${api.url}/addStatus`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
        mode: 'cors',
      });
      */
}

async function getFeed() {
    /**
    try{
        console.log("api url getFeed: ",`${api.url}/getFeed`);
        await axios.post(`${api.url}/getFeed`);
    }
    catch(err){
        console.log(err);
    }
    */
}

async function getStatus(statusId) {
    /**
    try{
        console.log("api url getFeed: ",`${api.url}/getStatus`);
        await axios.post(`${api.url}/getStatus/${statusId}`);
    }
    catch(err){
        console.log(err);
    }
    */
}

export {
    addStatus,
    getFeed,
    getStatus,
  };
