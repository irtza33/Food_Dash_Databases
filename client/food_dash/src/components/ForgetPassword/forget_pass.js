import './forget_pass.css';
import React from 'react';
import {useState} from 'react';

const ForgetPass=()=>{
  const [username, setUserame] = useState("");
  const [password, setPassword] = useState("");

  const displayInfo = () => {
    console.log(username + password);
  };

  return (
    <div class="App">
      <h1 className="Title">Forgot Password</h1>
      <div className="information">
        <h1 className="Heading">Reset Password</h1>
        <label className="Text">Email Address</label>
        <input type="email"/>
        <label className="Text">New Password</label>
        <input type="text" />
        <label className="Text">Confirm New Password</label>
        <input type="text"/>
        <button>Confirm</button>
      </div>
    </div>
  );
}

export default ForgetPass;
