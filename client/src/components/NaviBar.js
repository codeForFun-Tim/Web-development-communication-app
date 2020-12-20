import '../stylesheets/NaviBar.css';
import React, { useState, useEffect } from 'react'
import { logout } from '../javascripts/authRequests'

const NaviBar = () => {
  const [username, setUsername] = useState('');

  const logOut = async () => {
    await logout();
    localStorage.clear();
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("curr_user");
    if (loggedInUser && loggedInUser !== "") {
      setUsername(loggedInUser);
    }
    else {
      window.open("/login","_self");
    }
  }, []);

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
          <a href="/#" onClick={logOut}>Logout</a>
        </li>
        <li className="nav_li">
          <a href="/main">{username}</a>
        </li>
      </ul>
    </div>
  );
};

export default NaviBar;
