import React, { useState, useEffect } from 'react';
import NaviBar from './NaviBar';
// import { getFeed, getStatus } from '../javascripts/status';
import '../stylesheets/Status.css';
import Avatar from '../images/AvatarCat.png';

const Status = () => {
  const [username, setUsername] = useState('');
    /**
    const [feed, setFeed] = useState(null);
    const [status, setStatus] = useState(null);

    const generateFeed = async() => {
        // const feed = getFeed();
        const feed = ['A', 'B', 'C'];
        feed.forEach((feed) => {
            feedArray.push(
                <div class="circle">{feed}</div>
            ); 
        });  
    };   
    */

   useEffect(() => {
    const loggedInUser = localStorage.getItem("curr_user");
    if (loggedInUser && loggedInUser !== "") {
      setUsername(loggedInUser);
    }
    else {
      window.open("/login","_self");
    }
  }, []);


  const displayStatus = async(type) => {
      // const status = getStatus();
      if (type === 'img') {
          const statusDiv = document.createElement('img');
          statusDiv.setAttribute('class', 'imageStatus');
          statusDiv.src = Avatar;
          document.getElementById('status').innerHTML = '';
          document.getElementById('status').appendChild(statusDiv);
      }
      else {
          const statusDiv = document.createElement('p');
          statusDiv.setAttribute('class', 'textStatus');
          statusDiv.innerText = 'Hello';
          document.getElementById('status').innerHTML = '';
          document.getElementById('status').appendChild(statusDiv);
      }
  }

  function sendStatus() {
      closepopWindow();
  }

  function popupWindow() {
      const popup = document.getElementById('popup1');
      popup.style.visibility = 'visible';
      const sendStatus = document.getElementById('sendStatus');
      sendStatus.style.visibility = 'hidden';
    }
  
  function closepopWindow() {
      const popup = document.getElementById('popup1');
      popup.style.visibility = 'hidden';
      const sendStatus = document.getElementById('sendStatus');
      sendStatus.style.visibility = 'hidden';
      const textarea = document.getElementById('textarea');
      textarea.value = '';
      textarea.style.visibility = 'hidden';
  }

  function displayTextArea() {
      const textarea = document.getElementById('textarea');
      textarea.style.visibility = 'visible';
      const sendBtn = document.getElementById('sendStatus');
      sendBtn.style.visibility = 'visible';
  }

  // On file upload (click the upload button)
  const onFileUpload = (selectedFile) => {
      // Create an object of formData
      const formData = new FormData();
      // Update the formData object
      formData.append('myFile', selectedFile, selectedFile.name);
      // Request made to the backend api
      // Send formData object
      //axios.post("api/uploadfile", formData);
  };

  function selectImage(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
          onFileUpload(selectedFile);
          // finally we should use the data retrieved from mongoDB in setMessage
          const src = URL.createObjectURL(selectedFile);
          // image
          if (
            selectedFile.name.endsWith('.png') ||
            selectedFile.name.endsWith('.jpg')
          ) {
            const imgDiv = `<img width="320" height="240" src=${src} alt="The picture is gone.">`;
            //setMessage(imgDiv);
          }
      }
  }

  const feedArray = [<div className="circle" key='0'><button id='btn0' className="statusLink" onClick={displayStatus.bind(this, 'img')}>A</button></div>, 
      <div className="circle" key='1'><button id='1' className="statusLink" onClick={displayStatus.bind(this, 'text')}>B</button></div>];

  return (
    <div>
      <NaviBar />
      <h1 align="center">Status</h1>
      <p align="center" onClick={() => popupWindow()}><button>Send New Status</button></p>
      <div className="mainProfile">
        <div className="outer" id='outer'>
          {feedArray}
        </div>
        <div id='status'>  </div>
        <div id="popup1" className="overlay">
        <div className="popup">
          <h2>New Status</h2>
          <a id="closepop" className="close" onClick={() => closepopWindow()}>Close</a>
          <p>
              <button id="textOption" onClick={() => displayTextArea()}>Text</button>
              <button id='imageOption'>
                  <label htmlFor="image-upload">Image</label>
                  <input
                      id="image-upload"
                      type="file"
                      onChange={selectImage}
                      accept="image/png, image/jpg"
                  />
              </button>
              <textarea id='textarea' rows="4" cols="40" style={{visibility: 'hidden'}}></textarea>
              <button id="sendStatus" onClick={() => sendStatus()}>
                  SEND
              </button>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};


export default Status;