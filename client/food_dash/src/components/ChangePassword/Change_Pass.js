import React from "react";
import "./Change_Pass.css";
import { useState } from "react";
import axios from "axios";

const ChangePass = () => {
  const [password, setPassword] = useState("");
  const [newPwd, setnewPwd] = useState("");
  const [username, setUserName] = useState("");
  const [oldPwd, setOldPwd] = useState("");

  const check = () => {
    if (newPwd != password) {
      alert("Please make sure both passwords match!");
    } else {
      const newObj = {
        username: username,
        password: password,
        newPwd: newPwd,
        oldPwd: oldPwd,
      };
      axios
        .post("https://group-26-backend.herokuapp.com/Common/Cpass", newObj, {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) {
            alert(response.data.error);
            //alert("You are not logged in!")
            // window.location ='/'
          } else {
            console.log(response.data);
            alert("Pwd changed!");
          }
        });
    }
  };

  return (
    <div class="App">
      <h1 className="Title">Change Password</h1>
      <div className="information">
        <h1 className="Heading">Reset Password</h1>
        <label className="Text">Username</label>
        <input
          type="text"
          onChange={(event) => {
            setUserName(event.target.value);
          }}
        />
        <label className="Text">Old Password</label>
        <input
          type="text"
          onChange={(event) => {
            setOldPwd(event.target.value);
          }}
        />
        <label className="Text">New Password</label>
        <input
          type="text"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <label className="Text">Confirm New Password</label>
        <input
          type="text"
          onChange={(event) => {
            setnewPwd(event.target.value);
          }}
        />
        <button onClick={check}>Confirm</button>
      </div>
    </div>
  );
};

export default ChangePass;
