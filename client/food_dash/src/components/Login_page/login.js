import React from 'react';
import {useState} from 'react';

import './login.css';

const LoginPage=()=>{
  const [username, setUserame] = useState("");
  const [password, setPassword] = useState("");

  const displayInfo = () => {
    console.log(username + password);
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
        <input type="text" onChange={(event) =>{ 
          setPassword(event.target.value);
        }}/>
        <button onClick={displayInfo}>Login</button>
      </div>
    </div>
  );
}

export default LoginPage;
