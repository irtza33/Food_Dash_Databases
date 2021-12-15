import axios from "axios";
import React from "react";
import Select from "react-select";
import { useState, useContext } from "react";
import { authContext } from "../../Helper/authContext";

import "./offer_a_deal.css";

const OfferAdeal = () => {
  const [deal_details, setDealDetails] = useState("");
  const [deal_name, setDealName] = useState("");
  const [deal_price, setDealPrice] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newObj = {
      deal_name: deal_name,
      cat: deal_details,
      deal_price: deal_price,
    };

    axios
      .post("https://group-26-backend.herokuapp.com/rest_main/OfferDeal", newObj, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          window.location = "/";
        } else {
          alert("Deal Added!");
          window.location = "/";
          console.log(response.data);
        }
      });
  };

  return (
    <div class="App">
      <h1 className="Title">Offer A DEAL</h1>
      <div className="information">
        <h1 className="Heading">Enter Deal Information</h1>
        <label className="Text">Deal Name</label>
        <input
          type="resxt"
          onChange={(event) => {
            setDealName(event.target.value);
          }}
        />
        <label className="text">Deal Details</label>
        <input
          type="text"
          onChange={(event) => {
            setDealDetails(event.target.value);
          }}
        />
        <label className="number">Price</label>
        <input
          type="number"
          onChange={(event) => {
            setDealPrice(event.target.value);
          }}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};
export default OfferAdeal;
