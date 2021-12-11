import axios from 'axios';
import React from 'react';
import {useState} from 'react';
import { Switch, Route, Redirect } from "react-router-dom";

import './main_page_customer.css'


const goPage=()=>{
    axios.get("http://localhost:3001/main_view",
    {headers:{'Content-Type': 'application/json; charset=UTF-8','accessToken':localStorage.getItem("accessToken")}})
    .then(response=>{
        if(response.data.error){
            alert("You are not logged in!")
            window.location ='/'
        }else{
            console.log(response.data)  
        }
    })    
}


const Main_Page_Customer=()=>{ 
return (
    <div>
        {goPage()}
    </div>
  );
}

export default Main_Page_Customer;
