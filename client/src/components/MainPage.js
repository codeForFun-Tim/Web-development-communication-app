import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import NaviBar from './NaviBar';
import {ChatView} from './ChatView';

function MainPage() {
  let history = useHistory();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("curr_user");
    if (!loggedInUser || loggedInUser === "") {
      history.push("/login");
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
