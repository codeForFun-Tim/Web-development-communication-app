import React, { useState, useEffect } from 'react'
import '../stylesheets/LoginRegister.css'
const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  return  (
    <div>
        <h1 align="center">Welcome to Our App</h1>
        <div className="main">
            <p className="sign" align="center">Login</p>
            <form class="formLogin">
                <input className="userName" type="text" align="center" placeholder="Username" />
                <input className="pass" type="password" align="center" placeholder="Password" />
                <p className="forgotPwd" align="center"><a href="#" />Forgot Password?</p>
                <a className="loginBtn" align="center"><b>Login</b></a><a className="registerBtn" align="center"><b>Register</b></a>
            </form>  
        </div>
    </div>
    )
}

export default Login;
