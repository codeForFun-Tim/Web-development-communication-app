import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import { login } from '../javascripts/authRequests'
import '../stylesheets/LoginRegister.css'

const Login = () => {
  const [username, setUsername] = useState("");
  //const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  const handleLogin = (event) => {
    event.preventDefault();
    const name = document.getElementById('userName').value;
    const pwd = document.getElementById('password').value;
    setError(false);
    setLoading(true);
    login(name, pwd).then((res) => 
      {
        if (res.ok) {
          localStorage.setItem('curr_user', name);
          history.push("/main");
        } else {
          setError("Incorrect Username/Password (Account will be locked by 3 incorrect trials)");
        }
      }).catch(() => 
        {
          setError("Incorrect Username/Password (Account will be locked by 3 incorrect trials)");
        });
    setLoading(false);
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("curr_user");
    if (loggedInUser && loggedInUser !== "") {
      setUsername(loggedInUser);
      history.push("/main");
    }
  }, []);

  return  (
    <div>
        <h1 align="center">Welcome to Our App</h1>
        <div className="main">
            <p className="sign" align="center">Login</p>
            <form className="formLogin">
                <input className="userName" id="userName" type="text" align="center" placeholder="Email: cat@gmail.com" />
                <input className="pass" id="password" type="password" align="center" placeholder="Password" />
                <Link to='/changePassword'><p className="forgotPwd" align="center">Forgot Password?</p></Link>
                <input type="button" id="loginBtn" value={loading ? 'Loading' : 'Sign In'} onClick={handleLogin} disabled={loading} className="loginBtn" />
                <Link to='/Register'>
                  <button id="registerBtn" className="registerBtn" align="center">
                    <b>Register</b>
                  </button>
                </Link>
                {error && <><div id="error" style={{ color: 'red', fontSize: 12, textAlign: "center" }}>{error}</div><br /></>}<br />
            </form>  
        </div>
        <>         
        </>
    </div>
    );
}

export default Login;