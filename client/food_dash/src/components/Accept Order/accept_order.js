import axios from "axios";
import React from "react";
import Select from "react-select";
import { useState, useEffect } from "react";
import { authContext } from "../../Helper/authContext";

const AcceptOrder = () => {
  const [order_id, setItemID] = useState("");
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    axios
      .get("https://group-26-backend.herokuapp.com/rest_main/view_order", {
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

  const submitForm = (event) => {
    event.preventDefault();
    const newObj = {
      order_id: order_id,
    };

    axios
      .post("https://group-26-backend.herokuapp.com/rest_main/accept_order", newObj, {
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
          alert("Order accepted!");
        }
      });

    //to be connected
  };

  const submitStatus = (event) => {
    event.preventDefault();
    const newObj = {
      order_id: order_id,
    };

    axios
      .post("https://group-26-backend.herokuapp.com/rest_main/change_order_status", newObj, {
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
          alert("Order status changed!");
        }
      });

    //to be connected
  };

  const submitDelivery = (event) => {
    event.preventDefault();
    const newObj = {
      order_id: order_id,
    };

    axios
      .post("https://group-26-backend.herokuapp.com/rest_main/order_delivered", newObj, {
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
          alert("Order status changed!");
        }
      });

    //to be connected
  };

  return (
    <div class="App">
      <h1 className="Title">Accept orders</h1>
      Please input order id of order you want to accept.
      <input
        type="number"
        onChange={(event) => {
          setItemID(event.target.value);
        }}
      />
      <button onClick={submitForm}>Accept Order</button>{" "}
      <h1 className="Title">Orders enroute</h1>
      Please input order id of order you have dispatched.
      <input
        type="number"
        onChange={(event) => {
          setItemID(event.target.value);
        }}
      />
      <button onClick={submitStatus}>Change Order Status</button>{" "}
      <h1 className="Title">Orders delivered</h1>
      Please input order id of order you have delivered.
      <input
        type="number"
        onChange={(event) => {
          setItemID(event.target.value);
        }}
      />
      <button onClick={submitDelivery}>Change Order Status</button> Current
      Order List:
      <p>Order ID, Bill, Time Placed At </p>
      {orderData &&
        orderData.map((d) => {
          return (
            <div key={d}>
              <h4>
                <b>
                  {d.order_id}, {d.total_bill}, {d.current_status}
                </b>
              </h4>
            </div>
          );
        })}
    </div>
  );
};

export default AcceptOrder;
