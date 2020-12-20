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
    const [message, setMessage] = useState(false);

    const validation = (password) => {
        let pattern = new RegExp(/^[0-9a-zA-Z]+$/);
        if (!pattern.test(password)) {
            const msg = "Alphanumeric characters only for password";
            setMessage(msg); 
            return false;
          }
        return true;
    };
    const handleSubmit = (event) => {
        //event.preventDefault();
        const email = document.getElementById('email').value;
        const userName = document.getElementById('userName').value;
        const pwd = document.getElementById('password').value;
        if (validation(pwd)) {
            setIsSubmitting(true);
            register(email, userName, pwd)
            .then((res) => {
                if (res.ok) {
                    setMessage('Successful, please wait');
                    setTimeout(() => {history.push("/login")}, 2000);
                }
                else {
                    setMessage('Failed');
                }
            })
            .catch(() => {
                setMessage('Failed');
            });
            setIsSubmitting(false);
        }
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
                    {message && <><div id="error" style={{ color: 'red', fontSize: 12, textAlign: "center" }}>{message}</div><br /></>}<br />
                </form>  
            </div>
        </div>
    );
}

export default Register;