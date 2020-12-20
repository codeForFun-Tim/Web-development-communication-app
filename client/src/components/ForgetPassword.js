import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { changePassword } from '../javascripts/authRequests'
import '../stylesheets/Profile.css';

const ForgetPassword = () => {

  const [error, setError] = useState(false);
  let history = useHistory();
  
  const validation = (password) => {
    let pattern = new RegExp(/^[0-9a-zA-Z]{8,}$/);
    if (!pattern.test(password)) {
        const msg = "At least 8 alphanumeric characters for password";
        setError(msg); 
        return false;
      }
    return true;
  };

  const handleChangePassword = (event) => {
    event.preventDefault();
    let email = document.getElementById('userName').value;
    let newPassword = document.getElementById('newPassword').value;
    if (validation(newPassword)) {
      changePassword(email, newPassword).then((res) => {
        if (res.status === 200) {
          localStorage.clear();
          history.push("/login");
        }
        else {
          setError("Failed to change password, non-existed user");
        }
      }).catch(() => {
        setError("Failed to change password, non-existed user");
      });
    }
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
        {error && <><div id="error" style={{ color: 'red', fontSize: 12, textAlign: "center" }}>{error}</div><br /></>}<br />
      </div>
    </div>
  );
};

export default ForgetPassword;
