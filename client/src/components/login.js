import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import '../stylesheets/LoginRegister.css'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleLogin = () => {
    setError(false);
    setLoading(true);
    fetch('http://localhost:8080/users/login', { username: username.value, password: password.value }).catch(error => {
      // wait for backend
      // if (error.response.status === 401) setError(error.response.data.message);
      // else 
      setLoading(false);
      setError("Something went wrong. Please try again later.");
    });
  }

  return  (
    <div>
        <h1 align="center">Welcome to Our App</h1>
        <div className="main">
            <p className="sign" align="center">Login</p>
            <form className="formLogin">
                <input className="userName" type="text" align="center" placeholder="Username: cat@gmail.com" />
                <input className="pass" type="password" align="center" placeholder="Password" />
                <p className="forgotPwd" align="center"><a href="#" />Forgot Password?</p>
                <input type="button" value={loading ? 'Loading' : 'Sign In'} onClick={handleLogin} disabled={loading} className="loginBtn" />
                <Link to='/Register'>
                  <button className="registerBtn" align="center">
                    <b>Register</b>
                  </button>
                </Link>
                {error && <><div style={{ color: 'red', fontSize: 12, textAlign: "center" }}>{error}</div><br /></>}<br />

            </form>  
        </div>
        <>         
        </>
    </div>
    );
}

export default Login;
