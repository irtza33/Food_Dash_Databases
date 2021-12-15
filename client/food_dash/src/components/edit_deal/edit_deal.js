import axios from 'axios';
import React from 'react';
import Select from 'react-select'
import {useState,useContext} from 'react';
import {authContext} from '../../Helper/authContext'

import './edit_deal.css'


const EditDeal=()=>{
        const [changed, setChanged] = useState("");
        const [item_id, setItemId] = useState(0);
                
        const handleSubmit = (event) => {
        event.preventDefault();
        const newObj={
          item_id: item_id,
          changed: changed
        };
        
        axios
        .post("https://group-26-backend.herokuapp.com/Rest_main/EditDeal", newObj, {
            headers:{
                "Content-Type": 'application/json; charset=UTF-8',
                accessToken: localStorage.getItem("accessToken"),
            },
        })
        .then((response) => {
        if(response.data.error){
            //alert(response.data.error);
            window.location='/'
        }else {
            alert("Deal Edited!");
            window.location='/'
            console.log(response.data)
        }
        })
    };      
        
        return (
        <div class="App"> 
          <h1 className="Title">Edit DEAL</h1>
          <div className="information">
              <h1 className="Heading">UPDATE Deal Information</h1>
              <label className="number">Deal Id</label>
              <input type="number" onChange={(event) =>{ 
              setItemId(event.target.value);
              }}/>
              <label className="text">Enter New Name for Deal</label>
              <input type="text" onChange={(event) =>{ 
              setChanged(event.target.value);
              }}/>
              <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>    
    );
}
export default EditDeal;
