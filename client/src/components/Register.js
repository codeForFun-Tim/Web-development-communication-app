import React, { useState, useEffect } from 'react'
import {Link,useHistory}from 'react-router-dom'
import axios from "axios"; 
import '../stylesheets/LoginRegister.css'

function Register(user) {
    const history=useHistory()
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        axios.post('/signup',
            {username,
            nickname,
            password}
        )

        .then(data =>
            {console.log(data)
            history.push('/login')}
        )
    };
    
    return  (
        <div>
            <h1 align="center">Welcome to Our App</h1>
            <div className="main">
                <p className="sign" align="center">Register</p>
                <form class="formLogin">
                    <input className="userName" type="text" align="center" placeholder="Username: cat@gmail.com" />
                    <input className="nickName" type="text" align="center" placeholder="Nickname" />
                    <input className="pass" type="password" align="center" placeholder="Password" />
                    <button className="registerBtn2" align="center"><b>Register</b></button>
                </form>  
            </div>
        </div>
        );
}

export default Register;