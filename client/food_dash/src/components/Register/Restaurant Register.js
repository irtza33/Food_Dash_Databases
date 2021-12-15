import React from "react";
import "./Register_Page.css";
import { useState } from "react";
import axios from "axios";

const RestaurantRegisterPage = () => {
  const [username, setUserame] = useState("");
  const [manager_name, setMgr_name] = useState("");
  const [cashier_name, setCshr_name] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [open_status, setStatus] = useState("");

  const submitServer = (event) => {
    event.preventDefault();
    const newObject = {
      username: username,
      manager_name: manager_name,
      cashier_name: cashier_name,
      password: password,
      number: number,
      area: area,
      address: address,
      cuisine: cuisine,
    };
    axios
      .post("https://group-26-backend.herokuapp.com/auth/res", newObject, {
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.error) {
          alert(response.data.error);
        } else {
          alert("User created!");
          //  window.location = "/";
        }
      })
      .catch((error) => {
        alert(error.response);
      });
  };

  const handleUserChange = (event) => {
    setUserame(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };
  const handleAreaChange = (event) => {
    setArea(event.target.value);
  };
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  const handleMgr_nameChange = (event) => {
    setMgr_name(event.target.value);
  };
  const handleCshr_nameChange = (event) => {
    setCshr_name(event.target.value);
  };
  const handleCuisineChange = (event) => {
    setCuisine(event.target.value);
  };
  const handleOpen_statusChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <div class="App">
      <h1 className="Title">Welcome to FoodDash</h1>
      <div className="information">
        <h1 className="Heading">Restaurant Registration</h1>
        Please note that you need to have an active manager and cashier account
        to register as a restaurant.
        <label className="Text">Restaurant Name</label>
        <input type="text" onChange={handleUserChange} />
        <label className="Text">Manager Name</label>
        <input type="text" onChange={handleMgr_nameChange} />
        <label className="Text">Cashier Name</label>
        <input type="text" onChange={handleCshr_nameChange} />
        <label className="Text">Number</label>
        <input type="number" onChange={handleNumberChange} />
        <label className="Text">Area</label>
        <input type="text" onChange={handleAreaChange} />
        <label className="Text">Address</label>
        <input type="text" onChange={handleAddressChange} />
        <label className="Text">Cuisine</label>
        <input type="text" onChange={handleCuisineChange} />
        <button onClick={submitServer}>Register</button>
      </div>
    </div>
  );
};

export default RestaurantRegisterPage;
