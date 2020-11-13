/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import '../stylesheets/ChatView.css';

function ChatView() {
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

  // -----------------update chat title------------------------
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (title !== '') {
      const name_header = document.getElementById('chat_title');
      name_header.innerHTML = title;
    }
  }, [title]);

  function contacts_handler(e) {
    console.log(e.currentTarget.getAttribute('value'));
    const currentname = e.currentTarget.getAttribute('value');
    setTitle(currentname);
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
      myh3.innerHTML = '10:12AM, Today';
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
        <ul id="myul">
          <li
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
          </li>
        </ul>
      </aside>
      <main>
        <header>
          <div>
            <h2 id="chat_title">Vincent Porter</h2>
          </div>
        </header>
        <ul id="chat">
          <li class="you">
            <div class="entete">
              <span class="status green"></span>
              <h2>Vincent</h2>
              <h3>10:12AM, Today</h3>
            </div>
            {/* <div class="triangle"></div> */}
            <div class="message">Hi, this is the first message</div>
          </li>
          {/* <li class="me">
            <div class="entete">
              <h3>10:12AM, Today</h3>
              <h2>me</h2>
              <span class="status blue"></span>
            </div>
            <div class="message">This is the second message.</div>
          </li>
          <li class="me">
            <div class="entete">
              <h3>10:12AM, Today</h3>
              <h2>me</h2>
              <span class="status blue"></span>
            </div>
            <div class="message">OK</div>
          </li> */}
          <li class="you">
            <div class="entete">
              <span class="status green"></span>
              <h2>Vincent</h2>
              <h3>10:12AM, Today</h3>
            </div>
            <div class="message">Hello</div>
          </li>
          {/* <li class="me">
            <div class="entete">
              <h3>10:12AM, Today</h3>
              <h2>me</h2>
              <span class="status blue"></span>
            </div>
            <div class="message">Yes yes.</div>
          </li>
          <li class="me">
            <div class="entete">
              <h3>10:12AM, Today</h3>
              <h2>me</h2>
              <span class="status blue"></span>
            </div>
            <div class="message">OK</div>
          </li> */}
        </ul>
        <div id="btu_div">
          <button className="func_btu">Video Call</button>
          <button className="func_btu">Send Video</button>
          <button className="func_btu">Send Audio</button>
          <button className="func_btu">Send Image</button>
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
      </main>
    </div>
  );
}

export default ChatView;
