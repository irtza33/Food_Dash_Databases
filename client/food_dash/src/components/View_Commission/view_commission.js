import axios from 'axios';
import React from 'react';
import {useState,useEffect} from 'react';
import { Switch, Route, Redirect } from "react-router-dom";



const AdminViewCommission=()=>{
    const [comissionData,setcomissionData]=useState([])
    const [inputData,setInputData]=useState("")

    const handleInputChange=(event)=>{
        event.preventDefault()
        setInputData(event.target.value)
    }

    const getCommission=()=>{
        let newObj={
            restaurant_name:inputData
        }
        axios.post("https://group-26-backend.herokuapp.com/admin/getCommission",newObj,
        {headers:{'Content-Type': 'application/json; charset=UTF-8','accessToken':localStorage.getItem("accessToken")}})
        .then(response=>{
            if(response.data.error){
                alert(response.data.error)
                window.location ='/'
            }else{
                console.log(response.data.data)
                setcomissionData([{"commission":Math.round(response.data.data)}])
            }
        })
    }    

    return(
        <div>
            <h2>Comissions</h2>

            <label>Please input Restaurant Name</label>
            <input type={"text"}placeholder='ABC' onChange={handleInputChange}></input>
            <button onClick={getCommission}>Get Comission</button>

            <p>Comissions are 20% of entire order amount</p>
            {
                comissionData && comissionData.map((d)=>{
                    return(
                        <div key={d.restaurant_id}>
                        <ul><li>{d.commission}$</li></ul>

                        </div>
                    )
                })
            }
        </div>
    )
}

export default AdminViewCommission;