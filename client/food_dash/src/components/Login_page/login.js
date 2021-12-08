import axios from 'axios';
import React from 'react';
import Select from 'react-select'
import {useState,useContext} from 'react';
import {authContext} from '../../Helper/authContext'

import './login.css';

const LoginPage=()=>{
  const [username, setUserame] = useState("");
  const [password, setPassword] = useState("");
  const [userType,setUserType] = useState(0);
  const {setAuthState}=useContext(authContext)


  const options=[{value:1,label:"Customer"},{value:2,label:"Restaurant"},{value:3,label:"Manager"},{value:4,label:"Cashier"}]

  const setUser=(event)=>{
    let val = event.value
    console.log(val)
    setUserType(val)
  }

  const submitForm = (event) => {
    event.preventDefault()
    const newObj={
      username:username,
      password:password,
      userType:userType
    }
    console.log(newObj)
    axios.post('http://localhost:3001/auth/login',newObj,{
      headers:{'Content-Type': 'application/json; charset=UTF-8'}
    })
    .then(response=>{
      if(response.data.error){
        alert(response.data.error);
        window.location='/'
      }else if(response.data.accessToken){
        localStorage.setItem("accessToken",response.data.accessToken)
        setAuthState(true)
      }
    })
  };

  return (
    <div class="App"> 
      <h1 className="Title">Welcome Back to FoodDash</h1>
      <div className="information">
        <h1 className="Heading">Login</h1>
        <label className="Text">User Name</label>
        <input type="text" onChange={(event) =>{ 
          setUserame(event.target.value);
        }}/>
        <label className="Text">Password</label>
        <input type="password" onChange={(event) =>{ 
          setPassword(event.target.value);
        }}/>
        <div>
          <label>Select account type!</label>
          <Select options={options} onChange={setUser} />
        </div>
        <button onClick={submitForm}>Login</button>
      </div>
    </div>
  );
}

export default LoginPage;
