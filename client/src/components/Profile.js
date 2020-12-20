import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { changePassword } from '../javascripts/authRequests'
import { getUser } from '../javascripts/contact';
import '../stylesheets/Profile.css';
import Avatar from '../images/AvatarCat.png';
import NaviBar from './NaviBar';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState({name:'', registration:''});
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
    let email = username;
    let newPassword = document.getElementById('newPassword').value;
    if (validation(newPassword)) {
      changePassword(email, newPassword).then((res) => {
        console.log(res);
        if (res.status === 200) {
          localStorage.clear();
          history.push("/login");
        }
        else {
          setError("Failed to change password");
        }
      }).catch((e) => {
        setError("Failed to change password");
        console.log(e);
      });
    }

  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("curr_user");
    if (loggedInUser && loggedInUser !== "") {
      setUsername(loggedInUser);
      getUser(loggedInUser)
      .then((res) => {
        const registrationDate = res.data.registrationDate;
        setUserData({name: loggedInUser, registration: registrationDate})
      });
    }
    else {
      history.push("/login");
    }
  }, []);

  return (
    <div>
      <NaviBar />
      <h1 align="center">Profile</h1>
      <div className="mainProfile">
        <img src={Avatar} alt="Girl in a jacket" className="avatar" />
        <p id="userName" className="data" align="center">
          {userData.name}
        </p>
        <p id="registrationDate" className="data" align="center">
          {userData.registration}
        </p>
        <form className="formLogin">
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
          <button className="deactivateBtn" align="center">
            <b>Deactivate</b>
          </button>
        </form>
        ​{error && <><div id="error" style={{ color: 'red', fontSize: 12, textAlign: "center" }}>{error}</div><br /></>}<br />
      </div>
    </div>
  );
};

export default Profile;
