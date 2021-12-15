import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, Switch, Route, Redirect } from "react-router-dom";

import "./main_page_customer.css";

const Main_Page_Customer = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [restId, setRestId] = useState("");
  const [complaintText, setComplaintText] = useState("");

  const goPage = () => {
    axios
      .get("https://group-26-backend.herokuapp.com/main_view", {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert("You are not logged in!");
          window.location = "/";
        } else {
          console.log(response.data);
        }
      });
  };

  useEffect(() => {
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
          window.location = "/";
        } else {
          setRestaurantData(response.data.data);
        }
      });
  }, []);

  const navigate = useNavigate();
  const clickedResButton = (d) => {
    navigate("/menu_items", { state: d });
    // const newObj = d;
    // this.props.histo5y.push({
    //   pathname: "/menu",
    //   state: d,
    // });
    // axios
    //   .get("https://group-26-backend.herokuapp.com/rest_main/get_menu_items", d, {
    //     headers: {
    //       "Content-Type": "application/json; charset=UTF-8",
    //       accessToken: localStorage.getItem("accessToken"),
    //     },
    //   })
    //   .then((response) => {
    //     if (response.data.error) {
    //       alert(response.data.error);
    //     } else {
    //       setRestaurantData(response.data.data);
    //     }
    //   });
  };

  const submitComplaint = () => {
    const newObj = {
      restaurant_id: restId,
      complaintText: complaintText,
    };

    axios
      .post("https://group-26-backend.herokuapp.com/main_view/post_complaint", newObj, {
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
    <div>
      {goPage()}
      {restaurantData &&
        restaurantData.map((d) => {
          return (
            <div key={d}>
              <b>
                {d.restaurant_name}, {d.restaurant_area}, {d.phone_num}
              </b>
              <button
                onClick={() => {
                  clickedResButton(d);
                }}
              >
                See menu
              </button>
            </div>
          );
        })}
      <p> .</p>
      <p> .</p> If you would like to complain about a restaurant, you can do so
      below.
      <p>Enter Restaurant Id</p>
      <input
        type="number"
        onChange={(event) => {
          setRestId(event.target.value);
        }}
      ></input>
      <p>
        Enter complaint
        <input
          type="text"
          onChange={(event) => {
            setComplaintText(event.target.value);
          }}
        ></input>
      </p>
      <p>
        <button onClick={submitComplaint}>Lodge complaint</button>
      </p>
    </div>
  );
};

export default Main_Page_Customer;