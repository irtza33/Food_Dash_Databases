import axios from "axios";
import React from "react";
import Select from "react-select";
import { useState, useEffect } from "react";
import { authContext } from "../../Helper/authContext";

const Restaurant = () => {
  const [phone_number, setPN] = useState(0);

  const openStore = () => {
    const newObj = {};
    axios
      .post("http://localhost:3001/rest_main/open_store", newObj, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
          //alert("You are not logged in!")
          // window.location ='/'
        } else {
          console.log(response.data);
        }
      });
  };

  const closeStore = () => {
    const newObj = {};
    axios
      .post("http://localhost:3001/rest_main/close_store", newObj, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
          //alert("You are not logged in!")
          // window.location ='/'
        } else {
          console.log(response.data);
        }
      });
  };

  const cPhone = () => {
    const newObj = {
      phone_number: phone_number,
    };
    axios
      .post("http://localhost:3001/rest_main/Cphone", newObj, {
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
          alert(response.data.data);
        }
      });
  };

  return (
    <div class="App">
      <button onClick={openStore}>Open store</button>
      <button onClick={closeStore}>Close store</button>
      Please enter a new phone number if you would like to change it.
      <input
        type="number"
        onChange={(event) => {
          setPN(event.target.value);
        }}
      ></input>
      <button onClick={cPhone}>Change phone number</button>
    </div>
  );
};

export default Restaurant;