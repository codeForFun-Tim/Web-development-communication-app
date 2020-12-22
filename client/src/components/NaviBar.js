import '../stylesheets/NaviBar.css';
import React, { useState, useEffect } from 'react'
import { logout } from '../javascripts/authRequests'

const NaviBar = () => {
  const [username, setUsername] = useState('');

  const logOut = async () => {
    localStorage.clear();
    await logout();
  };

  return (
    <div>
      <ul id="nav_ul">
        <li className="nav_li">
          <a href="/profile">Profile</a>
        </li>
        <li className="nav_li">
          <a href="/main">Messaging</a>
        </li>
        <li className="nav_li">
          <a href="/status">Status</a>
        </li>
        <li className="nav_li">
          <a href="/login" onClick={logOut}>Logout</a>
        </li>
        <li className="nav_li">
          <a href="/main">{username}</a>
        </li>
      </ul>
    </div>
  );
};

export default NaviBar;
