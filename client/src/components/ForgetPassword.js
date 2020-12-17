import React from 'react';
import { changePassword } from '../javascripts/authRequests'
import '../stylesheets/Profile.css';

const ForgetPassword = () => {

  const handleChangePassword = (event) => {
    event.preventDefault();
    let email = document.getElementById('userName').value;
    let newPassword = document.getElementById('newPassword').value;
    changePassword(email, newPassword).then(() => {localStorage.clear(); window.open("/login","_self")}).catch((e) => {console.log(e);});
  }

  return (
    <div>
      <h1 align="center">change Password</h1>
      <div className="mainProfile">
        <form className="formLogin">
          <input
            id="userName"
            className="newPassword"
            type="text"
            align="center"
            placeholder="username"
          />
          <input
            id="newPassword"
            className="newPassword"
            type="password"
            align="center"
            placeholder="new password"
          />
          <button id="resetBtn" className="resetBtn" align="center" onClick={handleChangePassword}>
            <b>Change Password</b>
          </button>
        </form>
        ​
      </div>
    </div>
  );
};

export default ForgetPassword;
