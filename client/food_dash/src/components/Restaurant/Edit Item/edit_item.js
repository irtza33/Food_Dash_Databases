import axios from "axios";
import React from "react";
import Select from "react-select";
import { useState, useEffect } from "react";
import { authContext } from '../../../Helper/authContext';

const EditItem = () => {
  const [item_name, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [item_id, setItemID] = useState("");
  const [restaurant_id, setRestaurantID] = useState("");
  const [category, setCategory] = useState("");
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/rest_main/get_menu_items", {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
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
    event.preventDefault();
    const newObj = {
      item_name: item_name,
      item_id: item_id,
      price: price,
      category: category,
    };

    axios
      .post("http://localhost:3001/rest_main/EditItem", newObj, {
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
          alert("Item changed!");
        }
      });

    //to be connected
  };

  return (
    <div class="App">
      Current Item List:
      <p>Item ID, Item Name, Price, Category</p>
      {itemData &&
        itemData.map((d) => {
          return (
            <div key={d}>
              <h4>
                <b>
                  {d.item_id}, {d.item_name}, {d.price}, {d.category}
                </b>
              </h4>
            </div>
          );
        })}
      <h1 className="Title">Update Menu</h1>
      <div className="information">
        <h1 className="Heading">Edit Item</h1>
        <label className="Text">Item Name</label>
        <input
          type="text"
          onChange={(event) => {
            setItemName(event.target.value);
          }}
        />
        <label className="Text">Item Id</label>
        <input
          type="number"
          onChange={(event) => {
            setItemID(event.target.value);
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
        <button onClick={submitForm}>Edit Item</button>{" "}
      </div>
    </div>
  );
};

export default EditItem;
