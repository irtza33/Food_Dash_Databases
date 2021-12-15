import axios from 'axios';
import React from 'react';
import Select from 'react-select'
import {useState,useContext} from 'react';
import {authContext} from '../../Helper/authContext'

import './remove_discount.css'


const RemoveDiscount=()=>{
        const [item_id, setItemId] = useState(0);
                
        const handleSubmit = (event) => {
        event.preventDefault();
        const newObj={
          item_id: item_id
        };
        
        axios
        .post("https://group-26-backend.herokuapp.com/res_disc/remove_discount", newObj, {
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
            alert("Deal Removed!");
            window.location='/'
            console.log(response.data)
        }
        })
    };      
        
        return (
          <div class="App"> 
          <h1 className="Title">Remove Discount</h1>
          <div className="information">
              <h1 className="Heading">Enter Item Information</h1>
              <label className="number">Item ID</label>
              <input type="number" onChange={(event) =>{ 
              setItemId(event.target.value);
              }}/>
              <button onClick={handleSubmit}>Submit</button>
          </div>
          </div>
        );
}
export default RemoveDiscount;
