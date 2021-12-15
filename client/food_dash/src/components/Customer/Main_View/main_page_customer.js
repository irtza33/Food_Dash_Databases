import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, Switch, Route, Redirect } from "react-router-dom";

import "./main_page_customer.css";

const Main_Page_Customer = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [menuData, setMenuData] = useState([]);

  const goPage = () => {
    axios
      .get("http://localhost:3001/main_view", {
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
      .get("http://localhost:3001/main_view/get_restaurants", {
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
    //   .get("http://localhost:3001/rest_main/get_menu_items", d, {
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
    </div>
  );
};

export default Main_Page_Customer;
