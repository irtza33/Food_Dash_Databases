import axios from 'axios';
import React from 'react';
// import Select from 'react-select'
import {useState,useContext} from 'react';
import {authContext} from '../../Helper/authContext'

import './offer_discount.css'

const OfferDiscount=()=>{
    const [item_id, setItemId]=useState(0);
    const [restaurant_name, setRestaurantName] = useState("");
    const [percent_disc,setPercentDisc] = useState(0.0);
    const [price_after, setPriceAfter] = useState(0);
    const [status, setStatus] = useState("");
    const {setAuthState}=useContext(authContext)
   

    const submitForm = (event) => {
        event.preventDefault()
        const newObj={
        item_id:item_id,
        restaurant_name: restaurant_name,
        percent_disc: percent_disc,
        price_after: price_after,
        status: status
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
        <h1 className="Title">Offer Discount</h1>
        <div className="information">
            <h1 className="Heading">Enter Item Information</h1>
            <label className="Text">Item Id</label>
            <input type="number" onChange={(event) =>{ 
            setItemId(event.target.value);
            }}/>
            <label className="Text">Restaurant Name</label>
            <input type="text" onChange={(event) =>{ 
            setRestaurantName(event.target.value);
            }}/>
            <label className="number">Percentage Discount</label>
            <input type="float" onChange={(event) =>{ 
            setPercentDisc(event.target.value);
            }}/>
            <label className="number">Price After</label>
            <input type="number" onChange={(event)=>{
                setPriceAfter(event.target.value);
            }} />
            <label className="number">Status</label>
            <input type="number" onChange={(event)=>{
                setStatus(event.target.value);
            }} />
            <button onClick={submitForm}>Submit</button>
        </div>
        </div>
    );
}

export default OfferDiscount;
