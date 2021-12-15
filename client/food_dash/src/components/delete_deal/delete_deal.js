import axios from 'axios';
import React from 'react';
import Select from 'react-select'
import {useState,useContext} from 'react';
import {authContext} from '../../Helper/authContext'

import './delete_deal.css'


const DeleteDeal=()=>{
        const [id, setDealID] = useState(0);
                
        const handleSubmit = (event) => {
        event.preventDefault();
        const newObj={
          id: id,
        };
        
        axios
        .post("https://group-26-backend.herokuapp.com/Rest_main/DeleteDeal", newObj, {
            headers:{
                "Content-Type": 'application/json; charset=UTF-8',
                accessToken: localStorage.getItem("accessToken"),
            },
        })
        .then((response) => {
        if(response.data.error){
            alert(response.data.error);
            window.location='/'
        }else {
            //alert()
            console.log(response.data)
            alert("Deal Removed")
        }
        })
    };      
        
        return (
        <div class="App"> 
          <h1 className="Title">Delete DEAL</h1>
          <div className="information">
              <h1 className="Heading">Enter Deal Information</h1>
              <label className="number">Deal Id</label>
              <input type="number" onChange={(event) =>{ 
              setDealID(event.target.value);
              }}/>
              <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>    
    );
}
export default DeleteDeal;
