import React from 'react';
import NaviBar from './NaviBar';
import ChatView from './ChatView';

function MainPage() {
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
