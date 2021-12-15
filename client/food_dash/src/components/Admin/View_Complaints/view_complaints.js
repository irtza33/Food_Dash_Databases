import axios from 'axios';
import React from 'react';
import {useState,useEffect} from 'react';
import { Switch, Route, Redirect } from "react-router-dom";



const AdminViewComplaints=()=>{
    const [compliantData,setcompliantData]=useState([])
    const [inputData,setInputData]=useState("")

    const handleInputChange=(event)=>{
        event.preventDefault()
        setInputData(event.target.value)
    }

    const getComplaints=()=>{
        let newObj={
            restaurant_name:inputData
        }
        axios.post("http://localhost:3001/admin/get_complaints",newObj,
        {headers:{'Content-Type': 'application/json; charset=UTF-8','accessToken':localStorage.getItem("accessToken")}})
        .then(response=>{
            if(response.data.error){
                alert(response.data.error)
                window.location ='/'
            }else{
                setcompliantData(response.data.data)
            }
        })
    }    

    return(
        <div>
            <h2>Complaints</h2>

            <label>Please input Restaurant Name</label>
            <input type={"text"}placeholder='ABC' onChange={handleInputChange}></input>
            <button onClick={getComplaints}>Get Complaints</button>


            {
                compliantData && compliantData.map((d)=>{
                    return(
                        <div key={d.restaurant_id}>
                        <ul><li>{d.complaint_text}</li></ul>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default AdminViewComplaints;