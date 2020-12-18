import React, { useState, useEffect } from 'react';
import { getUser } from '../javascripts/contact';
import '../stylesheets/Profile.css';
import Avatar from '../images/AvatarCat.png';

const OtherProfile = ( { match } ) => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState({name:'', registration:''});
  const [error, setError] = useState(false);
  let params = match.params;

  useEffect(() => {
    const loggedInUser = localStorage.getItem("curr_user");
    if (loggedInUser && loggedInUser !== "") {
      console.log(1, params.otherUser);
      setUsername(params.otherUser);
      getUser(params.otherUser)
      .then((res) => {
        const registrationDate = res.data.registrationDate;
        setUserData({name: loggedInUser, registration: registrationDate})
      })
      .catch(() => {setError(true)});
    }
    else {
      window.open("/login","_self");
    }
  }, []);

  return (
    <div>
      <h1 align="center">Profile</h1>
      <div className="mainProfile">
          { error ? <p align="center">Not Found</p> : (
            <div>
              <img src={Avatar} alt="Girl in a jacket" className="avatar" />
              <p id="userName" className="data" align="center">
                {userData.name}
              </p>
              <p id="registrationDate" className="data" align="center">
                {userData.registration}
              </p>
            </div>
          )} ​
      </div>
    </div>
  );
};

export default OtherProfile;
