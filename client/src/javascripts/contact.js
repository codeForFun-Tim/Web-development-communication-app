import { api } from '../api';
import axios from 'axios';

async function getUser(username) {
    const apiUrl = `${api.url}/getUser`;
    try {
        const response = await axios.get(apiUrl, {
                params: {username: username}
            });
        return response;
    } catch(error) {
        throw new Error(error);
    }
};

async function getSortedUser(username) {
    const apiUrl = `${api.url}/getSortedUser`;
    try {
        const response = await axios.get(apiUrl, {
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
    const apiUrl = `${api.url}/blockUser`;
    try {
        const response = await axios.put(apiUrl, {
            username : username,
            userToBlock : delUserName,
        });
        return response;
    } catch(error) {
        throw new Error(error);
    }
};

async function getSuggestedUsers(username){ //username is an email
    const apiUrl = `${api.url}/getSuggestedUsers`;
    try{
        const response = await axios.get(apiUrl,{
            params: {username: username},
        });
        return response;
    }
    catch(err){
        throw new Error(err);
    }
};


export {
    getUser,
    addContact,
    deleteContact,
    getSuggestedUsers,
    getSortedUser
  };