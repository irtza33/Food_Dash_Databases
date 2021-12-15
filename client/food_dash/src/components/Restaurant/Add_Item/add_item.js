import axios from "axios";
import React from "react";
import Select from "react-select";
import { useState, useContext } from "react";
import {authContext} from '../../../Helper/authContext'

const AddItem = () => {
  const [item_name, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [restaurant_id, setRestaurantID] = useState("");

  const submitForm = (event) => {
    event.preventDefault();
    const newObj = {
      item_name: item_name,
      price: price,
      category: category,
    };

    axios
      .post("http://localhost:3001/rest_main/AddItem", newObj, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
          //alert("You are not logged in!")
          // window.location ='/'
        } else {
          console.log(response.data);
        }
      });
  };

  return (
    <div class="App">
      <h1 className="Title">Update Menu</h1>
      <div className="information">
        <h1 className="Heading">Add Item</h1>
        <label className="Text">Item Name</label>
        <input
          type="text"
          onChange={(event) => {
            setItemName(event.target.value);
          }}
        />
        <label className="Text">Price</label>
        <input
          type="number"
          onChange={(event) => {
            setPrice(event.target.value);
          }}
        />
        <label className="Text">Category</label>
        <input
          type="text"
          onChange={(event) => {
            setCategory(event.target.value);
          }}
        />
        <button onClick={submitForm}>Add Item</button>{" "}
      </div>
    </div>
  );
};

export default AddItem;
