import React, { useState, useEffect } from 'react'
import {Link, useHistory} from 'react-router-dom'
import { register } from '../javascripts/authRequests'
import '../stylesheets/LoginRegister.css'

function Register(user) {
    const history=useHistory()
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        const email = document.getElementById('email').value;
        const userName = document.getElementById('userName').value;
        const pwd = document.getElementById('password').value;
        setIsSubmitting(true);
        // leave axios code here
        register(email, userName, pwd)
        .then(() => {window.open("/login","_self")})
        .catch((e) => {console.log(e)});
        setIsSubmitting(false);
    };

    return  (
        <div>
            <h1 align="center">Welcome to Our App</h1>
            <div className="main">
                <p className="sign" align="center">Register</p>
                <form className="formLogin">
                    <input className="userName" id="email" type="text" align="center" placeholder="Email: cat@gmail.com" />
                    <input className="nickName" id="userName" type="text" align="center" placeholder="Username" />
                    <input className="pass" id="password" type="password" align="center" placeholder="Password" />
                    <input type="button" id="submitBtn" value={isSubmitting ? 'Submitting' : 'Register'} onClick={handleSubmit} className="registerBtn2" />
                </form>  
            </div>
        </div>
    );
}

export default Register;