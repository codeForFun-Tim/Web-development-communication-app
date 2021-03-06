/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from 'react';
import '../stylesheets/ChatView.css';
import { sendMessageAPI, sendMediaAPI, getMessageAPI, videoCallAPI } from '../javascripts/message';
import { getUser, addContact, deleteContact, getSuggestedUsers, getSortedUser} from '../javascripts/contact';
import {Room} from './Room';
import Push from 'push.js';
import beep from '../media/videoCalling.mp3';

Push.Permission.request();
let clip;

function pushNotifi(msgFrom){
  clip = new Audio(beep);
  clip.play();
  Push.create('Calling from '+msgFrom, {
    body: 'This is a notification.',
    icon: 'icon.png',
    timeout: 10000,                  // Timeout before notification closes automatically.
    vibrate: [100, 100, 100],       // An array of vibration pulses for mobile devices.
    onClick: function() {
        // Callback for when the notification is clicked. 
        clip.pause();
        //console.log(this);
    }  
});
}

let mycontacts = [];
// let mycontacts = ["cat@gmail.com", "dog@gmail.com", "guangzhe@test.com"];
// localStorage.setItem("curr_receiver", mycontacts[0].name);

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};

function sortByTime(a, b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return new Date(a.time) - new Date(b.time);
};

function sortByLatestTime(a, b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return new Date(b.latestTime) - new Date(a.latestTime);
};

function createImageDiv(message) {
  let base64 = btoa(new Uint8Array(message.content.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  const src = `data:image/jpeg;base64,${base64}`;
  //const src = `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, message.content.data))}`;
  return `<img width="320" height="240" src=${src} alt="The picture is gone.">`;
}

function createAudioDiv(message) {
  let base64 = btoa(new Uint8Array(message.content.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  const src = `data:audio/mpeg;base64,${base64}`;
  //const src = `data:audio/mpeg;base64,${btoa(String.fromCharCode.apply(null, message.content.data))}`;
  return  '<audio controls>' +
          `<source src=${src} type="audio/mpeg">` +
          'Your browser does not support the audio element.' +
          '</audio>';;
}

function createVideoDiv(message) {
  let base64 = btoa(new Uint8Array(message.content.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  const src = `data:video/mp4;base64,${base64}`;
  //const src = `data:video/mp4;base64,${btoa(String.fromCharCode.apply(null, message.content.data))}`;
  return  '<video width="320" height="240" controls>' +
          `<source src=${src} type="video/mp4">` +
          'Your browser does not support the video tag.' +
          '</video>';
}

// Generate local room ID
function generateRoomID(sender, receiver) {
  let roomid = '';
  if(sender>receiver){
    roomid = sender.concat(receiver);
  }
  else{
    roomid = receiver.concat(sender);
  }
  return roomid;
}

function putHistoryMsg(from, name, mesg){
  const myli = document.createElement('LI');
  myli.setAttribute('class', from);
  const mydiv = document.createElement('div');
  mydiv.setAttribute('class', 'entete');
  const myh3 = document.createElement('H3');
  myh3.innerHTML = mesg.time;
  const myh2 = document.createElement('H2');
  myh2.innerHTML = name;
  const msg = document.createElement('div');
  msg.setAttribute('class', 'message');
  if (mesg.type === 'text') {
    msg.innerHTML = mesg.content;
  }
  else if (mesg.type === 'image/jpeg') {
    msg.innerHTML = createImageDiv(mesg);
  }
  else if (mesg.type === 'video/mp4') {
    msg.innerHTML = createVideoDiv(mesg);
  }
  else if (mesg.type === 'audio/mpeg'){
    msg.innerHTML = createAudioDiv(mesg);
  } 
  else {
    msg.innerHTML = 'Invalid Type';
  }
  mydiv.appendChild(myh3);
  mydiv.appendChild(myh2);
  if(from === 'me') {
    const myspan = document.createElement('span');
    myspan.setAttribute('class', 'status blue');
    const span2 = document.createElement('span');
    span2.setAttribute('class', 'delieverednotice');
    span2.innerHTML='Delievered';
    mydiv.appendChild(myspan);
    mydiv.appendChild(span2);
  }
  myli.appendChild(mydiv);
  myli.appendChild(msg);

  const myul = document.getElementById('chat');
  myul.appendChild(myli);
  myul.scrollTop = myul.scrollHeight;
}

function ChatView() {

  // -----------------update contact list------------------------
  const [contactNum, setcontact] = useState(-1);

  useEffect(() => {
    if (contactNum !== -1) {
      const myul = document.getElementById('myul');
      myul.innerHTML = '';
      for (let i = 0; i < mycontacts.length; i++) {
        const myli = document.createElement('LI');
        const myh2 = document.createElement('H2');
        myli.setAttribute('value', mycontacts[i]);
        myli.setAttribute('id', mycontacts[i]);
        myli.onclick = function(e) {event_handler(e, 'value')};
        myh2.innerHTML = mycontacts[i]
        myli.appendChild(myh2);
        myul.appendChild(myli);
      }
      const currentContactName = localStorage.getItem("curr_receiver");
      contacts_handler(currentContactName);
      setcontact(-1);
    }
  }, [contactNum]);

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
    const currentUserName = localStorage.getItem("curr_user");
    const currentContactName = localStorage.getItem("curr_receiver");
    if(mycontacts.length !== 0 || currentContactName !=='' ) {
      // delete from frontend
      const index = mycontacts.findIndex(x => x === currentContactName);
      mycontacts.splice(index, 1);
      // delete from backend
      deleteContact(currentUserName, currentContactName);
      // refresh contact list
      setcontact(mycontacts.length);
      if (mycontacts.length !== 0) {
        localStorage.setItem("curr_receiver", mycontacts[0]);
        setTitle(mycontacts[0]);
      }
      else {
        localStorage.setItem("curr_receiver", '');
        setTitle('No Contacts');
      }
    }
  }

  // -----------------Add new user---------------------
  const [newContact, setnewContact] = useState('');

  useEffect(() => {
    // search if newContact exist in the database
    // if newContact exist, add new contact to contact list
    if(newContact !== '') {
      const current_user = localStorage.getItem("curr_user");
      addContact(current_user, newContact)
      .then((res) => {
        if (res.status === 201){
          mycontacts.push(newContact);
          setcontact(mycontacts.length);
        }
      }).catch((e) => {
        //console.log(e.response);
        if (e.response.status === 406) {
          alert("Already in your contact list.");
        }
        else{
          alert("Non-existed User.");
        }
      });

    }
  }, [newContact]);
  
  function addNewContact() {
    const input_value = document.getElementById('add_contact_input').value;
    setnewContact(input_value);
    closepopWindow3();
  }

  function closepopWindow3() {
    const popup = document.getElementById('popup3');
    const closepop = document.getElementById('closepop3');
    const btu = document.getElementById('add_contact_submit');
    const input = document.getElementById('add_contact_input');
    popup.style.visibility = 'hidden';
    closepop.style.visibility = 'hidden';
    btu.style.visibility = 'hidden';
    input.value = '';
    input.style.visibility = 'hidden';
  }

  function addUser(){
    const popup = document.getElementById('popup3');
    const closepop = document.getElementById('closepop3');
    const btu = document.getElementById('add_contact_submit');
    const input = document.getElementById('add_contact_input');
    popup.style.visibility = 'visible';
    closepop.style.visibility = 'visible';
    btu.style.visibility = 'visible';
    input.style.visibility = 'visible';
  }

  // -----------------Suggest new user-------------------------
  function suggest_event_handler(e){
    const clickeditem = e.currentTarget.innerHTML;
    const input = document.getElementById('add_contact_input');
    input.value = clickeditem;
  }

  function showDropDown() {
    const current_user = localStorage.getItem("curr_user");
    getSuggestedUsers(current_user)
      .then((res) => {
        if (res.status === 200){
          const suggestuser = document.getElementsByClassName("suggestuser");
          for (let i = 0; i < res.data.length; i++) {
            suggestuser[i].innerHTML = res.data[i];
            suggestuser[i].onclick = function(e) {suggest_event_handler(e)}
          }
        }
      }).catch((e) => {
        //console.log(e.response);
      });
    document.getElementById("myDropdown").classList.toggle("show");
  }

  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  // -----------------update chat title------------------------
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (title !== '') {
      const name_header = document.getElementById('chat_title');
      name_header.innerHTML = title;
    }
  }, [title]);

  const [readflag, setreadflag] = useState(false);
  useEffect(() => {
    if (readflag !== false) {
      const ifreadElments = document.getElementsByClassName('ifread');
      if (ifreadElments) {
        //console.log(ifreadElments[ifreadElments.length - 1]);
        if (ifreadElments[ifreadElments.length - 1]) {
          ifreadElments[ifreadElments.length - 1].style.display = 'inline';
          setreadflag(false);
        }
      }
    }
  }, [readflag]);


  function event_handler(e) {
    const current_click_name = e.currentTarget.getAttribute('value');
    localStorage.setItem("curr_receiver", current_click_name);
    // move current selected contact to the first place
    const curr_index = mycontacts.findIndex(x => x === current_click_name);
    mycontacts = array_move(mycontacts, curr_index, 0);
    setcontact(0);
    setcontact(mycontacts.length);
  }

  function contacts_handler(current_click_name) {
    // const currentname = e.currentTarget.getAttribute('value');
    const currentname = current_click_name;
    // // move current selected contact to the first place
    // const curr_index = mycontacts.findIndex(x => x === currentname);
    // mycontacts = array_move(mycontacts, curr_index, 0);
    // setcontact(0);
    // setcontact(mycontacts.length);
    setTitle(currentname);
    // localStorage.setItem("curr_receiver", currentname);
    const msgFrom = localStorage.getItem("curr_user");
    const chatWindow = document.getElementById('chat');
    chatWindow.innerHTML = '';
    setMessage('');
    let messageArray = [];
    getMessageAPI(msgFrom, currentname)
    .then(async (res) => 
      {
        const data = res.data;
        for (var i = 0; i < data.length; i++) {
          messageArray.push(data[i]);
        }
        messageArray.sort(sortByTime);
        const arraylength = messageArray.length;
        for (var index = 0; index < arraylength; index++) {
          // check if video call is accepted
          if (typeof messageArray[index].content === 'string' && messageArray[index].content.includes('<div class="callFlag">')) {
            let callflag = true;
            if (index+1<arraylength){
              for (var x = index+1; x < arraylength; x++){
                //console.log(messageArray[x].content);
                if (typeof messageArray[x].content === 'string' && messageArray[x].content.includes('<div class="endcallFlag">')) {
                  messageArray[index].content = 
                  '<div class="callFlag">'+
                  'Call Ended'+
                  '</div>';
                  callflag = false;
                  break;
                }
              }
            }
            if (callflag === true) {
              pushNotifi(msgFrom);
            }
          }          
          if (messageArray[index].sender === msgFrom) {
            if(messageArray[index].content !== '<div class="msgreadFlag">Above message has been read by</div>'){
              setRetrieveMessage(messageArray[index]);
            }          }
          // from you
          else if (messageArray[index].sender === currentname) { 
            if(messageArray[index].content === '<div class="msgreadFlag">Above message has been read by</div>'){
              setreadmsg(messageArray[index]);
            }       
            else {
              setOtherMessage(messageArray[index]);
            }
          }
        }
        // check the last message
        if(messageArray[arraylength-1].content !== '<div class="msgreadFlag">Above message has been read by</div>' || messageArray[arraylength-1].sender !== msgFrom){
          // sendVideoCall function just send a text msg to database
          sendVideoCall('<div class="msgreadFlag">Above message has been read by</div>');
          //console.log('send');
        }
        if(typeof messageArray[arraylength-1].content === 'string' && messageArray[arraylength-1].content.includes('<div class="endcallFlag">')){
          if(typeof messageArray[arraylength-2].content === 'string' && messageArray[arraylength-2].sender === msgFrom && messageArray[arraylength-2].content.includes('<div class="callFlag">')){
            window.alert("The user you called may not be online!");
          }
        }
        // display only the last read msg
        setreadflag(true);
      }
    )
    .catch((e) => {
      //console.log(e);
    });
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
      const span2 = document.createElement('span');
      span2.innerHTML='Delievered';
      const msg = document.createElement('div');
      msg.setAttribute('class', 'message');
      msg.innerHTML = message;

      mydiv.appendChild(myh3);
      mydiv.appendChild(myh2);
      mydiv.appendChild(myspan);
      mydiv.appendChild(span2);
      myli.appendChild(mydiv);
      myli.appendChild(msg);

      const myul = document.getElementById('chat');
      myul.appendChild(myli);
      myul.scrollTop = myul.scrollHeight;
    }
  }, [message]);

  async function sendMessage() {
    const current_user = localStorage.getItem("curr_user");
    let msg = document.getElementById('textarea').value;
    if (msg.startsWith("@")) {
      let latest_contacts = [];
      const res = await getUser(current_user);
      for (var i = 0; i < res.data.contacts.length; i++) {
          latest_contacts.push(res.data.contacts[i]);
      }
      //console.log(latest_contacts);
      let msgCopy = "";
      let ifValid = true;
      //alert("Muitlple mentioned users should be splitted by comma without white space, e.g. @user1,@user2");
      const mentionArray = msg.trim().split(',');
      for (var mentioned in mentionArray) {
        let mentionedUser = mentionArray[mentioned].substring(1);
        //console.log(mentionedUser);
        //console.log(latest_contacts.includes(mentionedUser));
        if (latest_contacts.includes(mentionedUser)){
          msgCopy += `<a href="/otherProfile/${mentionedUser}" target="_blank">${mentionArray[mentioned]}</a>`; 
        }
        else {
          ifValid = false;
        }
        //console.log(msgCopy);
        
      }
      msg = msgCopy;
      if (!ifValid) {
        alert("Some of mentioned users are not friends.");
      }
    };

    setMessage(msg);
    document.getElementById('textarea').value = '';
    // send to back end
    const msgType = 'text';
    const msgFrom = localStorage.getItem("curr_user");
    const msgTo = localStorage.getItem("curr_receiver");
    //const roomID = "5fd14b2e099e3b2aa8672745";
    sendMessageAPI(msg, msgType, msgFrom, msgTo, null);
  }

    // -----------------update chat message------------------------
    const [otherMessage, setOtherMessage] = useState(null); // here message is an object
    const currentContactName = localStorage.getItem("curr_receiver");

    useEffect(() => {
      if (otherMessage !== null) {
        putHistoryMsg('you', currentContactName, otherMessage);
        // const myli = document.createElement('LI');
        // myli.setAttribute('class', 'you');
        // const mydiv = document.createElement('div');
        // mydiv.setAttribute('class', 'entete');
        // const myh3 = document.createElement('H3');
        // myh3.innerHTML = otherMessage.time;
        // const myh2 = document.createElement('H2');
        // myh2.innerHTML = currentContactName;
        // const msg = document.createElement('div');
        // msg.setAttribute('class', 'message');
        // if (otherMessage.type === 'text') {
        //   msg.innerHTML = otherMessage.content;
        // }
        // else if (otherMessage.type === 'image/jpeg') {
        //   msg.innerHTML = createImageDiv(otherMessage);
        // }
        // else if (otherMessage.type === 'video/mp4') {
        //   msg.innerHTML = createVideoDiv(otherMessage);
        // }
        // else if (otherMessage.type === 'audio/mpeg'){
        //   msg.innerHTML = createAudioDiv(otherMessage);
        // } 
        // else {
        //   msg.innerHTML = 'Invalid Yype';
        // }
        // mydiv.appendChild(myh3);
        // mydiv.appendChild(myh2);
        // myli.appendChild(mydiv);
        // myli.appendChild(msg);
  
        // const myul = document.getElementById('chat');
        // myul.appendChild(myli);
        // myul.scrollTop = myul.scrollHeight;
      }
    }, [otherMessage]);

    const [retrievemessage, setRetrieveMessage] = useState(null);
    useEffect(() => {
      if (retrievemessage !== null) {
        putHistoryMsg('me', 'me', retrievemessage);
        // const myli = document.createElement('LI');
        // myli.setAttribute('class', 'me');
        // const mydiv = document.createElement('div');
        // mydiv.setAttribute('class', 'entete');
        // const myh3 = document.createElement('H3');
        // myh3.innerHTML = retrievemessage.time;
        // const myh2 = document.createElement('H2');
        // myh2.innerHTML = 'me';
        // const myspan = document.createElement('span');
        // myspan.setAttribute('class', 'status blue');
        // const span2 = document.createElement('span');
        // span2.innerHTML='Delievered';
        // const msg = document.createElement('div');
        // msg.setAttribute('class', 'message');
        // if (retrievemessage.type === 'text') {
        //   msg.innerHTML = retrievemessage.content;
        // }
        // else if (retrievemessage.type === 'image/jpeg') {
        //   msg.innerHTML = createImageDiv(retrievemessage);
        // }
        // else if (retrievemessage.type === 'video/mp4') {
        //   msg.innerHTML = createVideoDiv(retrievemessage);
        // }
        // else if (retrievemessage.type === 'audio/mpeg'){
        //   msg.innerHTML = createAudioDiv(retrievemessage);
        // } 
        // else {
        //   msg.innerHTML = 'Invalid Yype';
        // }
        // mydiv.appendChild(myh3);
        // mydiv.appendChild(myh2);
        // mydiv.appendChild(myspan);
        // mydiv.appendChild(span2);
        // myli.appendChild(mydiv);
        // myli.appendChild(msg);
  
        // const myul = document.getElementById('chat');
        // myul.appendChild(myli);
        // myul.scrollTop = myul.scrollHeight;
      }
    }, [retrievemessage]);
  
    const [readmsg, setreadmsg] = useState(null);
    useEffect(() => {
      if (readmsg !== null) {
        const myli = document.createElement('LI');
        myli.setAttribute('class', 'ifread');
        const mydiv = document.createElement('div');
        mydiv.setAttribute('class', 'entete');
        const myh3 = document.createElement('H3');
        myh3.innerHTML = 'System Notification: ';
        const myh2 = document.createElement('H2');
        myh2.innerHTML = readmsg.content + readmsg.sender;
        mydiv.appendChild(myh3);
        mydiv.appendChild(myh2);
        myli.appendChild(mydiv);
        const myul = document.getElementById('chat');
        myul.appendChild(myli);
        myul.scrollTop = myul.scrollHeight;
      }
    }, [readmsg]);

  // -----------------upload image/audio/video------------------------
  // On file upload (click the upload button)
  const onFileUpload = (data, type) => {
    // Create an object of formData
    const msgFrom = localStorage.getItem("curr_user");
    const msgTo = localStorage.getItem("curr_receiver");
    data.append("from", msgFrom);
    data.append("to", msgTo);
    data.append("message_type", type);
    data.append("roomID", "123");
    sendMediaAPI(data);
    // Request made to the backend api
    // Send formData object
    //axios.post("api/uploadfile", formData);
  };

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size/1024/1024 < 1) {
      // finally we should use the data retrieved from mongoDB in setMessage
      const src = URL.createObjectURL(selectedFile);
      const data = new FormData();
      data.append("media_message_content", selectedFile);
      onFileUpload(data, selectedFile.type);
      // image
      if (selectedFile.name.endsWith('.jpg')) {
        if (selectedFile.size/1024/1024 < 1) {
          const imgDiv = `<img width="320" height="240" src=${src} alt="vThe picture is gone.">`;
          setMessage(imgDiv);
        }
        else {
          alert("Image is too big, make sure it is less than 1 MB.");
        }

      }
      // audio
      else if (selectedFile.name.endsWith('.mp3')) {
        if (selectedFile.size/1024/1024 < 1) {
        const audioDiv =
          '<audio controls>' +
          `<source src=${src} type="audio/mpeg">` +
          'Your browser does not support the audio element.' +
          '</audio>';
          setMessage(audioDiv);
        }
        else {
          alert("Audio is too big, make sure it is less than 1 MB.");
        }
      }
      // video
      else if (selectedFile.name.endsWith('.mp4')) {
        if (selectedFile.size/1024/1024 < 1) {
          const videoDiv =
          '<video width="320" height="240" controls>' +
          `<source src=${src} type="video/mp4">` +
          'Your browser does not support the video tag.' +
          '</video>';
          setMessage(videoDiv);
        }
        else {
          alert("Video is too big, make sure it is less than 1 MB.");
        }
      }
      else {
        alert("Invalid file type");
      }
    }
    else {
      alert("Too big file.");
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
  let updaterRecord;
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
          updaterRecord = blob;
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
    const data = new FormData();
    data.append("media_message_content", updaterRecord);
    onFileUpload(data, "audio/mpeg");
    closepopWindow();
  }

  // -----------------start video call------------------------
  const [roomName, setRoomName] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    if(token === null) {
      if(mycontacts.length === 0 ) {
        // get all contacts from backend
        const current_user = localStorage.getItem("curr_user");
        let tempContacts = [];
        getSortedUser(current_user).then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            tempContacts.push(res.data[i]);
          }
          tempContacts.sort(sortByLatestTime);
          for (var j = 0; j < tempContacts.length; j++) {
            mycontacts.push(tempContacts[j].contact);
          }
          // set current receiver
          if(mycontacts.length !== 0) {
            localStorage.setItem("curr_receiver", mycontacts[0]);
            setcontact(mycontacts.length); // refresh contact list
          }
          else {
            localStorage.setItem("curr_receiver", '');
          }
        }).catch((e) => {
          //console.log(e)
        });
      }
      else{
        // set current receiver
        localStorage.setItem("curr_receiver", mycontacts[0]);
        setTitle('loading...');
        setcontact(0);
      }
    }
  }, [token]);

  function sendVideoCall(msg) {
    const msgType = 'text';
    const msgFrom = localStorage.getItem("curr_user");
    const msgTo = localStorage.getItem("curr_receiver");
    sendMessageAPI(msg, msgType, msgFrom, msgTo, null);
  }

  function declineCall() {
    if(clip){
      clip.pause();
    }
    const popup = document.getElementById('popup2');
    popup.style.visibility = 'hidden';
    const closepop2 = document.getElementById('closepop2');
    const yes_decline = document.getElementById('yes_decline');
    closepop2.style.visibility = 'hidden';
    yes_decline.style.visibility = 'hidden';
    const elements = document.getElementsByClassName('callFlag');
    elements[elements.length-1].innerHTML = 'Call Ended';
    // document.getElementById('decline_call').style.visibility = 'hidden'; 
    // document.getElementById('accept_call').style.visibility = 'hidden';
    // document.getElementById('call_msg').innerHTML = 'Call Ended';
    
    const myUserName = localStorage.getItem("curr_user");
    // const endcallFlag = 
    // '<div class="endcallFlag">'+
    // '</div>';
    // sendVideoCall(endcallFlag);
    sendVideoCall(`<div class="endcallFlag">${myUserName} Declined The Call </div>`);
  }

  function closepopWindow2() {
    const popup = document.getElementById('popup2');
    popup.style.visibility = 'hidden';
    const closepop2 = document.getElementById('closepop2');
    const yes_decline = document.getElementById('yes_decline');
    closepop2.style.visibility = 'hidden';
    yes_decline.style.visibility = 'hidden';
  }

  function closepopWindow2_accept() {
    const popup = document.getElementById('popup2_accept');
    popup.style.visibility = 'hidden';
    const closepop2 = document.getElementById('closepop2_accept');
    const yes_decline = document.getElementById('yes_accept');
    closepop2.style.visibility = 'hidden';
    yes_decline.style.visibility = 'hidden';
  }
  function inviteButton(){
    const videoCallDiv = inviteVideoCall();
    setMessage(videoCallDiv);
  }

  function inviteVideoCall(){
    const videoCallDiv = 
      '<div class="callFlag">'+
      '<div class="call_msg">'+
      'Calling...'+
      '</div>'+
      `<button id="decline_call" onclick="document.getElementById('popup2').style.visibility = 'visible'; 
      document.getElementById('closepop2').style.visibility = 'visible';
      document.getElementById('yes_decline').style.visibility = 'visible'">`+
      'Decline'+
      '</button>'+
      `<button id="accept_call" onclick="document.getElementById('popup2_accept').style.visibility = 'visible';
      document.getElementById('closepop2_accept').style.visibility = 'visible';
      document.getElementById('yes_accept').style.visibility = 'visible'">` +
      'Accept' +
      '</button>'+
      '</div>';
    // setMessage(videoCallDiv);
    sendVideoCall(videoCallDiv);
    return(videoCallDiv);
  }
  async function joinVideoCall(){
    if(clip){
      clip.pause();
    }
    const username = localStorage.getItem("curr_user");
    const receiver = localStorage.getItem("curr_receiver");
    const roomName = generateRoomID(username, receiver);
    setRoomName(roomName);
    const data = await videoCallAPI(username, roomName);
    setToken(data.token);
  }

  async function startVideoCall(){
    inviteVideoCall();
    joinVideoCall();
    // if(clip){
    //   clip.pause();
    // }
    // const username = localStorage.getItem("curr_user");
    // const receiver = localStorage.getItem("curr_receiver");
    // const roomName = generateRoomID(username, receiver);
    // setRoomName(roomName);
    // inviteVideoCall();
    // const data = await videoCallAPI(username, roomName);
    // setToken(data.token);
  }

  function refresh(){
    setToken(null);
  }

  const handleLogout = useCallback(event => {
    const minutesLabel = document.getElementById("minutes").innerHTML;
    const secondsLabel = document.getElementById("seconds").innerHTML;
    const username = localStorage.getItem("curr_user");
    sendVideoCall(`<div class="endcallFlag">${username} Spent ${minutesLabel}:${secondsLabel} in Video Chat Room </div>`);
    setTimeout(refresh, 1000);
    // setToken(null);
  }, []);

  // -----------------render html------------------------
  let render;
  if (token) {
    render = (
      <Room roomName={roomName} token={token} handleLogout={handleLogout} />
    );
  } else {
    render = (
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
        </ul>
      </aside>
      <main>
        <header>
          <div>
        <h2 id="chat_title">{}</h2>
          </div>
        </header>
        <ul id="chat">
        </ul>
        <div id="btu_div">
          <button className="func_btu" id="video_call" onClick={() => startVideoCall()}>Video Call</button>
          <button className="func_btu" id="invite_video" onClick={() => inviteButton()}>invite</button>
          <button className="func_btu">
            <label htmlFor="image-upload" className="custom-file-upload">
              <i className="fa fa-cloud-upload"></i> Send Image
            </label>
            <input
              id="image-upload"
              type="file"
              onChange={onFileChange}
              accept="image/jpeg"
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
          {title === '' ? <a id="submitbtu" href="#" style={{color:'gray'}}>Send</a> : <a id="submitbtu" href="#" onClick={() => sendMessage()}>
            Send
          </a>}
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
        <div id="popup2" className="overlay">
          <div className="popup">
            <h3>Are you sure to decline the call?</h3>
            <a id="closepop2" className="close" onClick={() => closepopWindow2()}>
              &times;
            </a>
            <p>
              <button id="yes_decline" onClick={() => declineCall()}>
                YES
              </button>
            </p>
          </div>
        </div>
        <div id="popup2_accept" className="overlay">
          <div className="popup">
            <h3>Ready to accpet the video call?</h3>
            <a id="closepop2_accept" className="close" onClick={() => closepopWindow2_accept()}>
              &times;
            </a>
            <p>
              <button id="yes_accept" onClick={() => joinVideoCall()}>
                YES
              </button>
            </p>
          </div>
        </div>         
        <div id="popup3" className="overlay">
          <div className="popup">
            <h2>Add New Contact</h2>
            <a id="closepop3" className="close" onClick={() => closepopWindow3()}>
              &times;
            </a>
            <div>
              <input
                id="add_contact_input"
                type="text"
                placeholder="Input Contact Name"
              />
              <div className="dropdown">
                <button id="addsuggest" onClick={() => showDropDown()} className="dropbtn">+</button>
                <div id="myDropdown" className="dropdown-content">
                  <a className="suggestuser">1</a>
                  <a className="suggestuser">2</a>
                  <a className="suggestuser">3</a>
                  <a className="suggestuser">4</a>
                  <a className="suggestuser">5</a>
                </div>
              </div>
            </div>
            <p>
              <button id="add_contact_submit" onClick={() => addNewContact()}>
                Submit
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
    );
  }
  return render;
};

export {
  ChatView, 
  array_move, 
  sortByTime, 
  sortByLatestTime,
  createImageDiv, 
  createAudioDiv, 
  createVideoDiv,
  generateRoomID,
  putHistoryMsg
};
