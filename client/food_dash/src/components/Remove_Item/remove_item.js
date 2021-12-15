import axios from "axios";
import React from "react";
import Select from "react-select";
import { useState, useEffect } from "react";
import { authContext } from "../../Helper/authContext";

const DeleteItem = () => {
  const [item_id, setItemID] = useState("");
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    axios
      .get("https://group-26-backend.herokuapp.com/rest_main/get_menu_itemsB", {
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
      item_id: item_id,
    };

    axios
      .post("https://group-26-backend.herokuapp.com/rest_main/DeleteItem", newObj, {
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
        <h1 className="Heading">Remove Item</h1>
        <label className="Text">Item Id</label>
        <input
          type="number"
          onChange={(event) => {
            setItemID(event.target.value);
          }}
        />
        <button onClick={submitForm}>Remove Item</button>{" "}
      </div>
    </div>
  );
};

export default DeleteItem;
