import React, { useState } from 'react'
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
                <input id="userName" className="userName" type="text" align="center" placeholder="Username" />
                <input id="password" className="pass" type="password" align="center" placeholder="Password" />
                <p className="forgotPwd" align="center"><a href="#" />Forgot Password? {error ? <><br /><small>{'Failed to login'}</small></> : <><br /><small style={{ color: "white"}}>{'.'}</small></>}</p>
                <a id="loginBtn" className="loginBtn" align="center" onClick={handleLogin}><b>{loading ? 'Loading' : 'Sign in  '}</b></a>
                <a id="Register" className="registerBtn" align="center" href="/register"><b>Register</b></a>
            </form>  
        </div>
    </div>
    )
}

export default Login;
