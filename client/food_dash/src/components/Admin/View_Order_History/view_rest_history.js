import axios from 'axios';
import React from 'react';
import {useState,useEffect} from 'react';
import { Switch, Route, Redirect } from "react-router-dom";



const AdminRestaurantView=()=>{
    const [restaurantData,setRestaurantData]=useState([])

    
    useEffect(() => {
        axios.get("http://localhost:3001/main_view/get_restaurants",
        {headers:{'Content-Type': 'application/json; charset=UTF-8','accessToken':localStorage.getItem("accessToken")}})
        .then(response=>{
            if(response.data.error){
                alert(response.data.error)
                window.location ='/'
            }else{
                setRestaurantData(response.data.data)
            }
        })    
    }, [])


    return(
        <div>
            <h2>All Restaurants Present in our Application</h2> 
            {
                restaurantData && restaurantData.map((d)=>{
                    return(
                        <div key={d.restaurant_id}>
                        <h4><b>{d.restaurant_name}</b></h4>
                        <p>{d.restaurant_area}</p>
                        <p>{d.phone_num}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default AdminRestaurantView;