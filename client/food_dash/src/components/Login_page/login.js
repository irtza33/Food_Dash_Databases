import axios from 'axios';
import React from 'react';
import {useState} from 'react';

import './login.css';

const LoginPage=()=>{
  const [username, setUserame] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = (event) => {
    event.preventDefault()
    const newObj={
      username:username,
      password:password
    }
    axios.post('http://localhost:3001/auth/login',newObj,{
      headers:{'Content-Type': 'application/json; charset=UTF-8'}
    })
    .then(response=>{
      if(response.data.error){
        alert(response.data.error);
      }else if(response.data.accessToken){
        sessionStorage.setItem("accessToken",response.data.accessToken)
      }
    })
  };

  return (
    <div class="App">
      <h1 className="Title">Welcome Back to FoodDash</h1>
      <div className="information">
        <h1 className="Heading">Login</h1>
        <label className="Text">Email Address</label>
        <input type="text" onChange={(event) =>{ 
          setUserame(event.target.value);
        }}/>
        <label className="Text">Password</label>
        <input type="password" onChange={(event) =>{ 
          setPassword(event.target.value);
        }}/>
        <button onClick={submitForm}>Login</button>
      </div>
    </div>
  );
}

export default LoginPage;
