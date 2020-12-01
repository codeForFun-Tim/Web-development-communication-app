import React, { useState, useEffect } from 'react';
import '../stylesheets/Profile.css';
import Avatar from '../images/AvatarCat.png';
import NaviBar from './NaviBar';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const url = window.location.href;
    if (url.split('/').length === 4) {
      setUsername(url.split('/').pop());
    }
    if (username !== '') {
      /**
        getUser(username).then((response) => {
            setUserData(response.json())
        });
        */
    }
  });

  return (
    <div>
      <NaviBar />
      <h1 align="center">Profile</h1>
      <div className="mainProfile">
        <img src={Avatar} alt="Girl in a jacket" className="avatar" />
        <p id="userName" className="data" align="center">
          {' '}
          data.name{' '}
        </p>
        <p id="registrationDate" className="data" align="center">
          {' '}
          data.registrationDate{' '}
        </p>
        <form className="formLogin">
          <input
            id="newPassword"
            className="newPassword"
            type="password"
            align="center"
            placeholder="new password"
          />
          <button id="resetBtn" className="resetBtn" align="center">
            <b>Change Password</b>
          </button>
          <button className="deactivateBtn" align="center">
            <b>Deactivate</b>
          </button>
        </form>
        ​
      </div>
    </div>
  );
};

export default Profile;
