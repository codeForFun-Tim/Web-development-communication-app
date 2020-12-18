import React, { useState, useEffect } from 'react';
import { getUser } from '../javascripts/contact';
import '../stylesheets/Profile.css';
import Avatar from '../images/AvatarCat.png';

const OtherProfile = ( { otherUser } ) => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState({name:'', registration:''});

  useEffect(() => {
    const loggedInUser = localStorage.getItem("curr_user");
    if (loggedInUser && loggedInUser !== "") {
      otherUser = decodeURI(otherUser);
      setUsername(otherUser);
      getUser(otherUser)
      .then((res) => {
        const registrationDate = res.data.registrationDate;
        setUserData({name: loggedInUser, registration: registrationDate})
      });
    }
    else {
      window.open("/login","_self");
    }
  }, []);

  return (
    <div>
      <h1 align="center">Profile</h1>
      <div className="mainProfile">
        <img src={Avatar} alt="Girl in a jacket" className="avatar" />
        <p id="userName" className="data" align="center">
          {userData.name}
        </p>
        <p id="registrationDate" className="data" align="center">
          {userData.registration}
        </p>    ​
      </div>
    </div>
  );
};

export default OtherProfile;
