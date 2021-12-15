import React from "react";
import "./Register_Page.css";
import { useState } from "react";
import axios from "axios";
import Select from "react-select";
const options = [
  { value: 3, label: "Manager" },
  { value: 4, label: "Cashier" },
];

const RegisterPageMC = () => {
  const [username, setUserame] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [bank_number, setBankNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [userType, setUserType] = useState(0);

  const options = [
    { value: 3, label: "Manager" },
    { value: 4, label: "Cashier" },
  ];

  const setUser = (event) => {
    let val = event.value;
    console.log(val);
    setUserType(val);
  };

  const submitServer = (event) => {
    event.preventDefault();
    const newObject = {
      username: username,
      password: password,
      email: email,
      number: number,
      name: name,
      address: address,
      userType: userType,
    };
    if (!email.includes("@")) {
      alert("Please enter a correct email address");
      return;
    }
    axios
      .post("https://group-26-backend.herokuapp.com/auth", newObject, {
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      })
      .then((response) => {
        console.log(response);
        if (response.data.error) {
          alert(response.data.error);
        } else if (response.data) {
          alert("User created!");
          //  window.location = "/";
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleUserChange = (event) => {
    setUserame(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  const handleDobChange = (event) => {
    setDob(event.target.value);
  };
  const handleBankChange = (event) => {
    setBankNumber(event.target.value);
  };
  const handleCvvChange = (event) => {
    setCvv(event.target.value);
  };
  const handleExpiryChange = (event) => {
    setExpiry(event.target.value);
  };

  return (
    <div class="App">
      <h1 className="Title">Welcome to FoodDash</h1>
      <div className="information">
        <h1 className="Heading">Register</h1>
        <label className="Text">User name</label>
        <input type="text" onChange={handleUserChange} />
        <label className="Text">Email Address</label>
        <input type="email" onChange={handleEmailChange} />
        <label className="Text">Phone Number</label>
        <input type="number" onChange={handleNumberChange} />
        <label className="Text">Password</label>
        <input type="password" onChange={handlePasswordChange} />
        <label className="Text">Name</label>
        <input type="text" onChange={handleNameChange} />
        <label className="Text">Address</label>
        <input type="text" onChange={handleAddressChange} />
        <div>
          <label>Select account type!</label>
          <Select options={options} onChange={setUser} />
        </div>
        <button onClick={submitServer}>Register</button>
      </div>
    </div>
  );
};

export default RegisterPageMC;
