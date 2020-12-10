/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import '../stylesheets/ChatView.css';
import { sendMessageAPI, sendMediaAPI } from '../javascripts/message';

let mycontacts = [{name: "cat@gmail.com", id: 1}, {name: "dog@gmail.com", id: 2}, {name: "guangzhe@test.com", id: 3}];
let currentContactID = 0;
let currentContactTitle = 'default';
localStorage.setItem("curr_receiver", mycontacts[0].name);

function ChatView() {

  // -----------------update contact list------------------------
  const [contactNum, setcontact] = useState(0);

  useEffect(() => {
    const myul = document.getElementById('myul');
    myul.innerHTML = '';
    for (let i = 0; i < mycontacts.length; i++) {
      const myli = document.createElement('LI');
      const myh2 = document.createElement('H2');
      myli.setAttribute('value', mycontacts[i].name);
      myli.setAttribute('id', mycontacts[i].id);
      myli.onclick = function(e) {contacts_handler(e, 'value')};
      myh2.innerHTML = mycontacts[i].name
      myli.appendChild(myh2);
      myul.appendChild(myli);
    }
  }, [contactNum]);

  // run once when first loading the page
  useEffect(() => {
    setcontact(mycontacts.length);
  }, []);

  // -----------------update search result------------------------
  const [name, setName] = useState('');

  useEffect(() => {
    const input = document.getElementById('myInput');
    const filter = input.value.toUpperCase();
    const ul = document.getElementById('myul');
    const li = ul.getElementsByTagName('li');
    for (let i = 0; i < li.length; i++) {
      let txtValue = li[i].getElementsByTagName('h2')[0].innerHTML;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = '';
      } else {
        li[i].style.display = 'none';
      }
    }
  }, [name]);
  
  // -----------------Delete selected user---------------------
  function deleteUser(){
    if(mycontacts.length !== 0 || currentContactID !==0 ) {
      const index = mycontacts.findIndex(o => o.id === parseInt(currentContactID));
      mycontacts.splice(index, 1);
      // console.log(mycontacts);
      currentContactID = 0;
      setcontact(mycontacts.length);
      if (mycontacts.length !== 0) {
        setTitle(mycontacts[0].name);
      }
      else {
        setTitle('No Contacts');
      }
    }
  }

  // -----------------Add new user---------------------
  function addUser(){
    setcontact(mycontacts);
  }

  // -----------------update chat title------------------------
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (title !== '') {
      const name_header = document.getElementById('chat_title');
      name_header.innerHTML = title;
    }
  }, [title]);

  function contacts_handler(e) {
    // console.log(e.currentTarget.getAttribute('value'));
    const currentname = e.currentTarget.getAttribute('value');
    currentContactID = e.currentTarget.getAttribute('id');
    setTitle(currentname);
    localStorage.setItem("curr_receiver", currentname);
  }

  // -----------------update chat message------------------------
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (message !== '') {
      const myli = document.createElement('LI');
      myli.setAttribute('class', 'me');
      const mydiv = document.createElement('div');
      mydiv.setAttribute('class', 'entete');
      const myh3 = document.createElement('H3');
      let raw_date = new Date();
      const month = raw_date.getMonth() + 1;
      const date = raw_date.getFullYear() + '-' + month + '-' + raw_date.getDate();
      const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
      myh3.innerHTML = date + ' ' + time;
      const myh2 = document.createElement('H2');
      myh2.innerHTML = 'me';
      const myspan = document.createElement('span');
      myspan.setAttribute('class', 'status blue');
      const msg = document.createElement('div');
      msg.setAttribute('class', 'message');
      msg.innerHTML = message;

      mydiv.appendChild(myh3);
      mydiv.appendChild(myh2);
      mydiv.appendChild(myspan);
      myli.appendChild(mydiv);
      myli.appendChild(msg);

      const myul = document.getElementById('chat');
      myul.appendChild(myli);
      myul.scrollTop = myul.scrollHeight;
    }
  }, [message]);

  function sendMessage() {
    const msg = document.getElementById('textarea').value;
    setMessage(msg);
    document.getElementById('textarea').value = '';
    // send to back end
    const msgType = 'text';
    const msgFrom = localStorage.getItem("curr_user");
    const msgTo = localStorage.getItem("curr_receiver");
    //const roomID = "5fd14b2e099e3b2aa8672745";
    sendMessageAPI(msg, msgType, msgFrom, msgTo, null);
  }

  // -----------------upload image/audio/video------------------------
  // On file upload (click the upload button)
  const onFileUpload = (selectedFile, type) => {
    // Create an object of formData
    const msgFrom = localStorage.getItem("curr_user");
    const msgTo = localStorage.getItem("curr_receiver");
    sendMediaAPI(selectedFile, type, msgFrom, msgTo, null);
    console.log(selectedFile);
    // Request made to the backend api
    // Send formData object
    //axios.post("api/uploadfile", formData);
  };

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // finally we should use the data retrieved from mongoDB in setMessage
      const src = URL.createObjectURL(selectedFile);
      const blob = new Blob([selectedFile], {type: selectedFile.type})
      onFileUpload(blob, selectedFile.type);
      // image
      if (
        selectedFile.name.endsWith('.png') ||
        selectedFile.name.endsWith('.jpg')
      ) {
        const imgDiv = `<img width="320" height="240" src=${src} alt="The picture is gone.">`;
        setMessage(imgDiv);
      }
      // audio
      else if (selectedFile.name.endsWith('.mp3')) {
        const audioDiv =
          '<audio controls>' +
          `<source src=${src} type="audio/mpeg">` +
          'Your browser does not support the audio element.' +
          '</audio>';
        setMessage(audioDiv);
      }
      // video
      else if (selectedFile.name.endsWith('.mp4')) {
        const videoDiv =
          '<video width="320" height="240" controls>' +
          `<source src=${src} type="video/mp4">` +
          'Your browser does not support the video tag.' +
          '</video>';
        setMessage(videoDiv);
      }
    }
  };

  // -----------------Send Recorded Audio------------------------
  function popupWindow() {
    const popup = document.getElementById('popup1');
    popup.style.visibility = 'visible';
    const startRecord = document.getElementById('startRecord');
    const stopRecord = document.getElementById('stopRecord');
    startRecord.style.visibility = 'visible';
    stopRecord.style.visibility = 'hidden';
  }

  function closepopWindow() {
    const popup = document.getElementById('popup1');
    popup.style.visibility = 'hidden';
    const startRecord = document.getElementById('startRecord');
    const stopRecord = document.getElementById('stopRecord');
    const sendRecord = document.getElementById('sendRecord');
    startRecord.style.visibility = 'hidden';
    stopRecord.style.visibility = 'hidden';
    sendRecord.style.visibility = 'hidden';
    const recordedAudio = document.getElementById('recordedAudio');
    recordedAudio.src = '';
    recordedAudio.controls = false;
  }

  let mediaRecorder;

  function Recording() {
    const recordedAudio = document.getElementById('recordedAudio');
    const startRecord = document.getElementById('startRecord');
    const stopRecord = document.getElementById('stopRecord');
    startRecord.style.visibility = 'hidden';
    stopRecord.style.visibility = 'visible';
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        let chunks = [];
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function (e) {
          // Store data stream chunks for future playback
          chunks.push(e.data);
        };

        mediaRecorder.onstop = function (e) {
          // Playback recording
          const blob = new Blob(chunks, {
            type: 'audio/ogg; codecs=opus',
          });
          recordedAudio.src = window.URL.createObjectURL(blob);
          recordedAudio.controls = true;
          recordedAudio.autoplay = true;

          // Clear recording
          chunks = [];
        };

        // Start recording!
        mediaRecorder.start();
      });
  }

  function stopRecording() {
    const startRecord = document.getElementById('startRecord');
    const stopRecord = document.getElementById('stopRecord');
    const sendRecord = document.getElementById('sendRecord');
    startRecord.style.visibility = 'visible';
    stopRecord.style.visibility = 'hidden';
    sendRecord.style.visibility = 'visible';
    mediaRecorder.stop();
  }

  function sendRecording() {
    const recordedAudio = document.getElementById('recordedAudio');
    const src = recordedAudio.src;
    const audioDiv =
      '<audio controls>' +
      `<source src=${src} type="audio/mpeg">` +
      'Your browser does not support the audio element.' +
      '</audio>';
    setMessage(audioDiv);
    closepopWindow();
  }

  return (
    <div id="container">
      <aside>
        <header>
          <input
            id="myInput"
            type="text"
            placeholder="search"
            onKeyUp={(event) => setName(event.target.value)}
          />
        </header>
        <footer>
          <button id = "deleteUser" onClick = {() => deleteUser()}>
            Delete
          </button>
          <button id = "addUser" onClick = {() => addUser()}>
            Add
          </button>
        </footer>
        <ul id="myul">
          {/* <li
            value={'Any'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Any</h2>
          </li>
          <li
            value={'Bob'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Bob</h2>
          </li>
          <li
            value={'Cat'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Cat</h2>
          </li>
          <li
            value={'Fish'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Fish</h2>
          </li>
          <li
            value={'Tiger'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Tiger</h2>
          </li>
          <li
            value={'Pig'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Pig</h2>
          </li>
          <li
            value={'Deer'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Deer</h2>
          </li>
          <li
            value={'Snake'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Snake</h2>
          </li>
          <li
            value={'Iiger'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Iiger</h2>
          </li>
          <li
            value={'Lion'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Lion</h2>
          </li>
          <li
            value={'Bear'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Bear</h2>
          </li>
          <li
            value={'Bird'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Bird</h2>
          </li>
          <li
            value={'Monkey'}
            onClick={(e) => contacts_handler(e, 'value')}
          >
            <h2>Monkey</h2>
          </li> */}
        </ul>
      </aside>
      <main>
        <header>
          <div>
        <h2 id="chat_title">{mycontacts[0].name}</h2>
          </div>
        </header>
        <ul id="chat">
          <li className="you">
            <div className="entete">
              <span className="status green"></span>
              <h2>{mycontacts[0].name} </h2>
              <h3>10:12AM, Today</h3>
            </div>
            {/* <div className="triangle"></div> */}
            <div className="message">Hi, this is the first message</div>
          </li>
          {/* <li className="me">
            <div className="entete">
              <h3>10:12AM, Today</h3>
              <h2>me</h2>
              <span className="status blue"></span>
            </div>
            <div className="message">This is the second message.</div>
          </li>
          <li className="me">
            <div className="entete">
              <h3>10:12AM, Today</h3>
              <h2>me</h2>
              <span className="status blue"></span>
            </div>
            <div className="message">OK</div>
          </li> */}
          <li className="you">
            <div className="entete">
              <span className="status green"></span>
              <h2>{mycontacts[0].name} </h2>
              <h3>10:12AM, Today</h3>
            </div>
            <div className="message">Hello</div>
          </li>
          {/* <li className="me">
            <div className="entete">
              <h3>10:12AM, Today</h3>
              <h2>me</h2>
              <span className="status blue"></span>
            </div>
            <div className="message">Yes yes.</div>
          </li>
          <li className="me">
            <div className="entete">
              <h3>10:12AM, Today</h3>
              <h2>me</h2>
              <span className="status blue"></span>
            </div>
            <div className="message">OK</div>
          </li> */}
        </ul>
        <div id="btu_div">
          <button className="func_btu">Video Call</button>
          <button className="func_btu">
            <label htmlFor="image-upload" className="custom-file-upload">
              <i className="fa fa-cloud-upload"></i> Send Image
            </label>
            <input
              id="image-upload"
              type="file"
              onChange={onFileChange}
              accept="image/png, image/jpg"
            />
          </button>
          <button className="func_btu">
            <label htmlFor="audio-upload" className="custom-file-upload">
              <i className="fa fa-cloud-upload"></i> Send Audio
            </label>
            <input
              id="audio-upload"
              type="file"
              onChange={onFileChange}
              accept="audio/mp3"
            />
          </button>
          <button id="recordAudio" className="func_btu" onClick={() => popupWindow()}>
            Record Audio
          </button>
          <button className="func_btu">
            <label htmlFor="video-upload" className="custom-file-upload">
              <i className="fa fa-cloud-upload"></i> Send Video
            </label>
            <input
              id="video-upload"
              type="file"
              onChange={onFileChange}
              accept="video/mp4"
            />
          </button>
        </div>
        <footer>
          <textarea
            id="textarea"
            placeholder="Type your message"
          ></textarea>
          <a id="submitbtu" href="#" onClick={() => sendMessage()}>
            Send
          </a>
        </footer>
        <div id="popup1" className="overlay">
          <div className="popup">
            <h2>Record</h2>
            <a id="closepop" className="close" onClick={() => closepopWindow()}>
              &times;
            </a>
            <p>
              <button id="startRecord" onClick={() => Recording()}>
                start
              </button>
              <button id="stopRecord" onClick={() => stopRecording()}>
                stop
              </button>
              <button id="sendRecord" onClick={() => sendRecording()}>
                SEND
              </button>
            </p>
            <p>
              <audio id="recordedAudio"></audio>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatView;
