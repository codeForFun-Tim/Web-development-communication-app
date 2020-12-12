import { api } from '../api';
import axios from 'axios';

async function getUser(username) {
    const apiUrl = `${api.url}/getUser`;
    try {
        const response = await axios.post(apiUrl, {
                params: {username: username}
            });
        return response;
    } catch(error) {
        throw new Error(error);
    }
};

async function addContact(username, addUserName) {
    const apiUrl = `${api.url}/addContact`;
    return axios.post(apiUrl, {
            username : username,
            addUserName : addUserName,
    });
};

async function deleteContact(username, delUserName) {
    const apiUrl = `${api.url}/delContact`;
    try {
        const response = await axios.put(apiUrl, {
            username : username,
            delUserName : delUserName,
        });
        return response;
    } catch(error) {
        throw new Error(error);
    }
};


export {
    getUser,
    addContact,
  };