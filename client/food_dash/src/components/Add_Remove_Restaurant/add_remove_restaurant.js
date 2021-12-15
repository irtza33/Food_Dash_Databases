import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

const AdminResAddRem = () => {
  const [activeRestaurants, setactiveRestaurants] = useState([]);
  const [pendingRestaurants, setpendingRestaurants] = useState([]);
  const [inputData, setInputData] = useState("");

  const handleInputChange = (event) => {
    event.preventDefault();
    setInputData(event.target.value);
  };

  const showPending = () => {
    let newObj = {};
    axios
      .post("https://group-26-backend.herokuapp.com/admin/show_pending", newObj, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
          //window.location ='/'
        } else {
          setpendingRestaurants(response.data.data);
        }
      });
  };
  const showActive = () => {
    let newObj = {};
    axios
      .get("https://group-26-backend.herokuapp.com/main_view/get_restaurants", {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          //window.location ='/'
        } else {
          setactiveRestaurants(response.data.data);
        }
      });
  };

  const removeRes = () => {
    let newObj = {
      restaurant_name: inputData,
    };
    axios
      .post("https://group-26-backend.herokuapp.com/admin/DeleteR", newObj, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert("ERROR");
          window.location = "/";
        } else {
          alert("Restaurant Removed!");
        }
      });
  };

  const acceptRes = (id) => {
    let newObj = {
      id: id,
    };
    axios
      .post("https://group-26-backend.herokuapp.com/admin/verify_res", newObj, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
          //window.location ='/'
        } else {
          alert("Restaurant Verified!");
        }
      });
  };

  return (
    <div>
      <h1>Add/Remove Restaurant</h1>

      <br></br>
      <h2>Remove Restaurant</h2>
      <button onClick={showActive}>Show Active Restaurants</button>
      <br></br>
      {activeRestaurants &&
        activeRestaurants.map((d) => {
          return (
            <div key={d.restaurant_id}>
              <ul>
                <li>
                  <h4>
                    <b>{d.restaurant_name}</b>
                  </h4>
                </li>
              </ul>
            </div>
          );
        })}
      <br></br>
      <label>Please input Restaurant Name to remove</label>
      <input
        type={"text"}
        placeholder="ABC"
        onChange={handleInputChange}
      ></input>
      <button onClick={removeRes}>Remove</button>
      <br></br>
      <h2>Confirm Restaurant</h2>
      <br></br>
      <button onClick={showPending}>Show Pending</button>
      {pendingRestaurants &&
        pendingRestaurants.map((d) => {
          return (
            <div key={d.restaurant_id}>
              <ul>
                <li>
                  <h4>
                    <b>{d.restaurant_name}</b>
                  </h4>
                </li>
              </ul>
              <button onClick={() => acceptRes(d.restaurant_id)}>
                Confirm Restaurant
              </button>
            </div>
          );
        })}
    </div>
  );
};

export default AdminResAddRem;
