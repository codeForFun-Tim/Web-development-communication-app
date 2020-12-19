/* globals fetch FormData */

import { api } from '../api';
import axios from 'axios';

async function register(email, username, password) { 
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('username', username);
  return fetch(`${api.url}/Register`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
      mode: 'cors',
    });
}

async function login(email, password) {
  return fetch(`${api.url}/login`,
  {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json; charset=UTF-8',
    },
    credentials: 'include',
    mode: 'cors',
  });

      // return axios.post(`${api.url}/login`,
      // `email=${email}&password=${password}`
      // );
}

async function logout() {
  return fetch(`${api.url}/logout`,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}

async function changePassword(email, newPassword) {
  return fetch(`${api.url}/login`,
  {
    method: 'POST',
    body: JSON.stringify({
      email,
      newPassword,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json; charset=UTF-8',
    },
    credentials: 'include',
    mode: 'cors',
  });

  // return axios.post(`${api.url}/changePassword`,
  // `email=${email}&&newPassword=${newPassword}`,
  // {
  //   withCredentials: true,
  // });
}

async function getUser(email) {
  return axios.get(`${api.url}/getUser`,
  `email=${email}`);
}

async function checkAuth() {
  return fetch(`${api.url}/checkAuth`,
    {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}

export {
  register,
  login,
  logout,
  changePassword,
  getUser,
  checkAuth,
};