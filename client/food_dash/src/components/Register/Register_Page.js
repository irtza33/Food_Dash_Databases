import React from 'react'
import './Register_Page.css';
import {useState} from 'react';
import axios from 'axios'

const RegisterPage=()=>{
  const [username, setUserame] = useState("");
  const [password, setPassword] = useState("");
  const [email,setEmail]=useState("")
  const [number,setNumber]=useState("")
  const [area,setArea]=useState("")
  const [address,setAddress]=useState("")
  const [dob,setDob]=useState("")

  const submitServer = (event) => {
    event.preventDefault()
    const newObject={
      username:username,
      password:password,
      email:email,
      number:number,
      area:area,
      address:address,
      dob:dob,
    }
    axios.post('http://localhost:3001/auth',newObject,{
      headers:{'Content-Type': 'application/json; charset=UTF-8'}
    })
    .then(response =>{
      console.log(response.data)
    })
    .catch(error =>{
      console.log(error.response)
    })
  };

  const handleUserChange=(event)=>{
    setUserame(event.target.value)
  }
  const handlePasswordChange=(event)=>{
    setPassword(event.target.value)
  }
  const handleEmailChange=(event)=>{
    setEmail(event.target.value)
  }
  const handleNumberChange=(event)=>{
    setNumber(event.target.value)
  }
  const handleAreaChange=(event)=>{
    setArea(event.target.value)
  }
  const handleAddressChange=(event)=>{
    setAddress(event.target.value)
  }
  const handleDobChange=(event)=>{
    setDob(event.target.value)
  }

  return (
    <div class="App">
      <h1 className="Title">Welcome to FoodDash</h1>
      <div className="information">
        <h1 className="Heading">Register</h1>
        <label className="Text">User name</label>
        <input type="text" onChange={handleUserChange}/>
        <label className="Text">Email Address</label>
        <input type="email" onChange={handleEmailChange}/>
        <label className="Text">Phone Number</label>
        <input type="number" onChange={handleNumberChange}/>
        <label className="Text">Password</label>
        <input type="password" onChange={handlePasswordChange}/>
        <label className="Text">Area</label>
        <input type="text" onChange={handleAreaChange}/>
        <label className="Text">Address</label>
        <input type="text" onChange={handleAddressChange} />
        <label className="Text">Date of Birth</label>
        <input type="date"onChange={handleDobChange} />
        <button onClick={submitServer}>Register</button>
      </div>
    </div>
  );
}

export default RegisterPage;
