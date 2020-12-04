import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { login } from '../javascripts/authRequests'
import '../stylesheets/LoginRegister.css'

const Login = () => {
  //const [username, setUsername] = useState("");
  //const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleLogin = () => {
    const name = document.getElementById('userName').value;
    const pwd = document.getElementById('password').value;
    setError(false);
    setLoading(true);
    login(name, pwd).then(() => {window.open("/main","_self")}).catch((e) => {setError("Something went wrong. Please try again later.");});
    setLoading(false);
  }

  return  (
    <div>
        <h1 align="center">Welcome to Our App</h1>
        <div className="main">
            <p className="sign" align="center">Login</p>
            <form className="formLogin">
                <input className="userName" id="userName" type="text" align="center" placeholder="Email: cat@gmail.com" />
                <input className="pass" id="password" type="password" align="center" placeholder="Password" />
                <p className="forgotPwd" align="center"><a href="#" />Forgot Password?</p>
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