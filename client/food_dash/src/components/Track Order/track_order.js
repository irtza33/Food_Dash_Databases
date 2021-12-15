import axios from "axios";
import React from "react";
import Select from "react-select";
import { useState, useEffect } from "react";
import { authContext } from "../../Helper/authContext";

const TrackOrder = () => {
  const [order_id, setItemID] = useState("");
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    axios
      .get("https://group-26-backend.herokuapp.com/rest_main/view_order_cust", {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          //window.location = "/";
        } else {
          setOrderData(response.data.data);
        }
      });
  }, []);

  const submitDelivery = (event) => {
    event.preventDefault();
    const newObj = {
      order_id: order_id,
    };

    axios
      .post("https://group-26-backend.herokuapp.com/rest_main/cancel_order", newObj, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          //alert("You are not logged in!")
          // window.location ='/'
        } else {
          alert(response.data.data);
        }
      });
  };

  return (
    <div class="App">
      <h1 className="Title">Track orders</h1>
      Please find your orders below. The topmost is the latest order.
      <p>Your orders</p>
      <p>Order ID, Bill, Status, Restaurant ID </p>
      {orderData &&
        orderData.map((d) => {
          return (
            <div key={d}>
              <h4>
                <b>
                  {d.order_id}, {d.total_bill}, {d.current_status},{" "}
                  {d.restaurant_id}{" "}
                </b>
              </h4>
            </div>
          );
        })}
      Please input order id of order you want to cancel.
      <input
        type="number"
        onChange={(event) => {
          setItemID(event.target.value);
        }}
      />
      <button onClick={submitDelivery}>Cancel Order</button>
    </div>
  );
};

export default TrackOrder;
