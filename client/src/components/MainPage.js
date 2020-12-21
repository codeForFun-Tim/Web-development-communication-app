import React, { useState, useEffect } from 'react'
import NaviBar from './NaviBar';
import {ChatView} from './ChatView';

function MainPage() {
  useEffect(() => {
    const loggedInUser = localStorage.getItem("curr_user");
    if (!loggedInUser || loggedInUser === "") {
      window.open("/login","_self");
    }
  }, []);
  return (
    <div id="m-parent">
      <div id="m-navi">
        <NaviBar />
      </div>
      <div id="m-content">
        <ChatView />
      </div>
    </div>
  );
}

export default MainPage;
