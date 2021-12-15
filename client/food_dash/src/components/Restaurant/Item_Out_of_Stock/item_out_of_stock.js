import axios from "axios";
import React from "react";
import Select from "react-select";
import { useState, useContext } from "react";
import { authContext } from '../../../Helper/authContext';

const ItemOutOfStock = () => {
  const [item_id, setItemID] = useState("");
  const [itemData, setItemData] = useState([]);

  const submitForm = (event) => {
    event.preventDefault();
    const newObj = {
      item_id: item_id,
    };
    axios
      .post("http://localhost:3001/rest_main/ItemFinish", newObj, {
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
          alert("Item changed!");
        }
      });
    //to be connected
  };

  return (
    <div class="App">
      <h1 className="Title">Update Menu</h1>
      <div className="information">
        <h1 className="Heading" style={{ "text-align": "center" }}>
          Mark Item Out of Stock
        </h1>
        <label className="Text">Item Id</label>
        <input
          type="number"
          onChange={(event) => {
            setItemID(event.target.value);
          }}
        />
        <button onClick={submitForm} style={{ "font-size": "16px" }}>
          Mark out of stock
        </button>{" "}
      </div>
    </div>
  );
};

export default ItemOutOfStock;
