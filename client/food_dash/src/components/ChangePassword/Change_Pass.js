import React from 'react';
import './Change_Pass.css';
import {useState} from 'react';

const ChangePass=()=> {
  const [username, setUserame] = useState("");
  const [password, setPassword] = useState("");

  const displayInfo = () => {
    console.log(username + password);
  };

  return (
    <div class="App">
      <h1 className="Title">Change My Password</h1>
      <div className="information">
        <h1 className="Heading">Change Password</h1>
        <label className="Text">Email Address</label>
        <input type="email"/>
        <label className="Text">Current Password</label>
        <input type="text" />
        <label className="Text">New Password</label>
        <input type="text"/>
        <label className="Text">Confirm New Password</label>
        <input type="text"/>
        <button>Confirm</button>
      </div>
    </div>
  );
}

export default ChangePass;
