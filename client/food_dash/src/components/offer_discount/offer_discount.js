import axios from 'axios';
import React from 'react';
// import Select from 'react-select'
import {useState,useContext,useEffect} from 'react';
import {authContext} from '../../Helper/authContext'

import './offer_discount.css'

const OfferDiscount=()=>{
    const [item_id, setItemId]=useState(0);
    // const [restaurant_name, setRestaurantName] = useState("");
    const [price_after, setPriceAfter] = useState(0);
    const [itemData, setItemData] = useState([]);
   
    
    useEffect(() => {
        axios
          .get("https://group-26-backend.herokuapp.com/rest_main/get_menu_items", {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((response) => {
            console.log(response)
            if (response.data.error) {
              console.log(response.data.error);
              alert(response.data.error);
              window.location = "/";
            } else {
              setItemData(response.data.data);
            }
          });
      }, []);
    
    const submitForm = (event) => {
        event.preventDefault()
        const newObj={
        item_id:item_id,
        price_after: price_after,
        };
        //alert(JSON.stringify(newObj))
        //
        
    axios
      .get("https://group-26-backend.herokuapp.com/res_disc/offer_discount", {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
            console.log("Changed!");
        }
        });
        axios
        .post("https://group-26-backend.herokuapp.com/Res_disc/offer_discount", newObj, {
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
            alert("Deal Added")
            console.log(response.data)
            window.location='/offer_discount'
        }
        })
    };

    return (
        <div class="App"> 
        Current Item List:
        <p>Item ID, Item Name, Price</p>
        {itemData &&
            itemData.map((d) => {
            return (
                <div key={d}>
                <h4>
                    <b>
                    {d.item_id}, {d.item_name}, {d.price}
                    </b>
                </h4>
                </div>
            );
            })}
        <h1 className="Title">Offer Discount</h1>
        <div className="information">
            <h1 className="Heading">Enter Item Information</h1>
            <label className="Text">Item Id</label>
            <input type="number" onChange={(event) =>{ 
            setItemId(event.target.value);
            }}/>
            <label className="number">Price After</label>
            <input type="number" onChange={(event)=>{
                setPriceAfter(event.target.value);
            }} />
            <button onClick={submitForm}>Submit</button>
        </div>
        </div>
    );
}

export default OfferDiscount;
