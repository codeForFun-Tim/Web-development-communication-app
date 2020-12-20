import '../stylesheets/NaviBar.css';
import React, { useState, useEffect } from 'react'

const NaviBar = () => {
  const [username, setUsername] = useState('');

  const logout = () => {
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
          <a href="/" onClick={logout}>Logout</a>
        </li>
        <li className="nav_li">
          <a href="/main">{username}</a>
        </li>
      </ul>
    </div>
  );
};

export default NaviBar;
