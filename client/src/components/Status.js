import React, { useState, useEffect } from 'react';
import NaviBar from './NaviBar';
import { addTextStatus, addMediaStatus, getFeed, viewedStatus } from '../javascripts/status';
import '../stylesheets/Status.css';
import Avatar from '../images/AvatarCat.png';

const Status = () => {
  const [username, setUsername] = useState('');
  const [type, setType] = useState('text');
  const [imageSrc, setImageSrc] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [senderList, setSenderList] = useState([]);
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

   function sortByTime(a, b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.creationTime) - new Date(a.creationTime);
  };

  function createImageDiv(message) {
    let base64 = btoa(new Uint8Array(message.mediaStatus.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    const src = `data:image/jpeg;base64,${base64}`;
    return src;
  }

  function createGifDiv(message) {
    let base64 = btoa(new Uint8Array(message.mediaStatus.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    const src = `data:image/gif;base64,${base64}`;
    return src;
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("curr_user");
    if (loggedInUser && loggedInUser !== "") {
      setUsername(loggedInUser);
    }
    else {
      window.open("/login","_self");
    }
    getFeed(loggedInUser)
    .then((res) => 
    {
      let feedArray = [];
      //let senderArray = [];
      const data = res.data;
      for (var i = 0; i < data.length; i++) {
        feedArray.push(data[i]);
        //senderArray.push(data[i].);
      }
      feedArray.sort(sortByTime);      
      //const feedArray = ['image', 'text'];
      //const senderArray = [<div className="circle" key='0'>A</div>, <div className="circle" key='1'>B</div>];
      let statusIndex = 0
      setTextContent("Welcome to Status Page");
      const interval = setInterval(() => {
        if (statusIndex < feedArray.length) {
          setType(feedArray[statusIndex].type);
          //console.log(feedArray[statusIndex]);
          //setSenderList(senderArray);
          if (feedArray[statusIndex].type === "image/jpeg") {
            let src = createImageDiv(feedArray[statusIndex]);
            setImageSrc(src);
            viewedStatus(loggedInUser, feedArray[statusIndex]._id).catch(() => {});
          }
          else if(feedArray[statusIndex].type === "image/gif") {
            let src = createGifDiv(feedArray[statusIndex]);
            setImageSrc(src);
            viewedStatus(loggedInUser, feedArray[statusIndex]._id).catch(() => {});
          }
          else {
            setTextContent(feedArray[statusIndex].textStatus);
            viewedStatus(loggedInUser, feedArray[statusIndex]._id).catch(() => {});
          }
          statusIndex += 1;
          //feedArray.shift();
        }
        else {
          setTextContent("");
          setType('text');
        }
      }, 3000);
      return () => clearInterval(interval);
    })
    .catch((e) => 
    {
      console.log(e);
      alert("No contacts!");
    });
  }, []);

  function sendStatus() {
      const loggedInUser = localStorage.getItem("curr_user");
      const text = document.getElementById('textarea').value;
      addTextStatus(loggedInUser, text).catch(() => alert("Failed to send this status."));
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

  function selectImage(event) {
    const loggedInUser = localStorage.getItem("curr_user");
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        if (selectedFile.name.endsWith('.jpg') || selectedFile.name.endsWith('.gif')) {
          if (selectedFile.size/1024/1024 < 1) {
            addMediaStatus(loggedInUser, selectedFile).catch(() => alert("Failed to send this Image/Gif."));
            closepopWindow();
          }
          else {
            alert("Image is too big, make sure it is less than 1 MB.");
          }
        }
      }

  }

  return (
    <div>
      <NaviBar />
      <h1 align="center">Status</h1>
      <p align="center" onClick={() => popupWindow()}><button>Send New Status</button></p>
      <div className="mainProfile">
        <div className="outer" id='outer'>
          {}
        </div>
        <div id='status'> 
          {type === 'image/jpeg' || type === 'image/gif' ? <img className='imageStatus' width="400" height="300" src={imageSrc} alt="lost..."></img> : <p className='textStatus'> {textContent} </p> }
        </div>
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
                    accept="image/jpeg, image/gif"
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