import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { authContext } from "./Helper/authContext";
import { setPermissionContext } from './Helper/setPermissionContext';
import { useState, useEffect } from "react";

import LoginPage from "./components/Login_page/login";
import RegisterPage from "./components/Register/Register_Page";
import ForgetPass from "./components/ForgetPassword/forget_pass";
import ChangePass from "./components/ChangePassword/Change_Pass";
import Main_Page_Customer from "./components/Main_Customer_Page/main_page_customer";
import OfferDiscount from "./components/offer_discount/offer_discount";
import OfferAdeal from "./components/offer_a_deal/offer_a_deal";
import AddItem from "./components/Add_Item/add_item";
import DeleteItem from "./components/Remove_Item/remove_item";
import EditItem from "./components/Edit Item/edit_item";
import ItemInStock from "./components/Item_in_Stock/item_in_stock";
import ItemOutOfStock from "./components/Item_Out_of_Stock/item_out_of_stock";
import Restaurant from "./components/Restaurant Main Page/restaurant";
import Menu from "./components/menu_items";
import RestaurantRegisterPage from "./components/Register/Restaurant Register";
import RegisterPageMC from "./components/Register/RegisterMC";
import AdminRestaurantView from "./components/View_Restaurant/view_rest_admin";
import AdminViewComplaints from "./components/View_Complaints/view_complaints";
import AdminViewCommission from "./components/View_Commission/view_commission";
import AdminResAddRem from "./components/Add_Remove_Restaurant/add_remove_restaurant";
import AdminViewHistory from "./components/View_Order_History/view_rest_history";
import AcceptOrder from "./components/Accept Order/accept_order";
import TrackOrder from "./components/Track Order/track_order";
import DeleteDeal from "./components/delete_deal/delete_deal";
import EditDeal from "./components/edit_deal/edit_deal";
import RemoveDiscount from "./components/remove_discount/remove_discount";

function App() {
  const [authState, setAuthState] = useState(false);
  const [permissionState, setPermissionState]=useState(false); //Permission Set or Not
  const [currentPermission, setCurrentPermission]=useState(-1);//Set Permission Type

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setAuthState(true);
    }
    if(localStorage.getItem("permission")){
      setPermissionState(true)
      setCurrentPermission(localStorage.getItem("permission"))
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("permission")
    setAuthState(false);
    setPermissionState(false);
  };

  return (
    <authContext.Provider value={{ authState, setAuthState }}>
      <setPermissionContext.Provider value={{permissionState,setPermissionState}}>
      <Router>
        <div>
          <Link style={{ padding: 5 }} to="/">
            Home
          </Link>
          {!authState ? (
            <>
              <Link style={{ padding: 5 }} to="/login">
                Login
              </Link>
              <Link style={{ padding: 5 }} to="/register">
                Register
              </Link>
              <Link style={{ padding: 5 }} to="/forget_pass">
                Forget Password
              </Link>
              <Link style={{ padding: 5 }} to="/register_restaurant">
                Register as restaurant
              </Link>
              <Link style={{ padding: 5 }} to="/register_manager_cashier">
                Register as manager/cashier
              </Link>
            </>
          ) : (
            <>
            {/*Customer*/}
            {console.log(currentPermission)}
            {currentPermission == 1 ? (
              <>
              <Link style={{ padding: 5 }} to="/change_pass">
                Change Password
              </Link>
              <Link style={{ padding: 5 }} to="/main_view_customer">
               Customer Page
              </Link>
              <Link style={{ padding: 5 }} to="/track_order">
                Track Order
              </Link>
              </>
            ):(
              <>
              </>
            )}
            {/*Manager*/}
            {
              
              currentPermission == 3 ? (
                <>
              <Link style={{ padding: 5 }} to="/add_item">
                Add Item
              </Link>
              <Link style={{ padding: 5 }} to="/remove_item">
                Remove Item
              </Link>
              <Link style={{ padding: 5 }} to="/edit_item">
                Edit Item
              </Link>
              <Link style={{ padding: 5 }} to="/item_in_stock">
                Mark Item in Stock
              </Link>
              <Link style={{ padding: 5 }} to="/item_out_stock">
                Mark Item Out of Stock
              </Link>
              <Link style={{ padding: 5 }} to="/restaurant_main">
                Restaurant Home
              </Link>
              <Link style={{ padding: 5 }} to="/offer-a-deal">Offer Deal</Link>
              <Link style={{ padding: 5 }} to="/offer_discount">Offer Discount</Link>
              <Link style={{ padding: 5 }} to="/rem_discount">Remove Discount</Link>
              <Link style={{ padding: 5 }} to="/delete_deal">Delete Deal</Link>
              <Link style={{ padding: 5 }} to="/edit_deal">Edit Deal</Link>
              
              

                </>
              ):(
                <>
                </>
              )}
              {/*Cashier*/}
              {currentPermission == 4 ? (
                <>
              <Link style={{ padding: 5 }} to="/accept_order">
                Show orders
              </Link>
                </>
              ):(
                <>
                </>
              )}
              {/*Admin*/}
              {currentPermission == 5? (
                <>
                <Link style={{ padding: 5 }} to="/AdminResAddRem">Admin Add/Remove</Link>
                <Link style={{ padding: 5 }} to="/AdminViewHistory">Admin View Order History</Link>
                <Link style={{ padding: 5 }} to="/AdminViewCommission">Admin View Commission</Link>
                <Link style={{ padding: 5 }} to="/AdminViewComplaints">Admin View Complaints</Link>
                <Link style={{ padding: 5 }} to="/admin_res_view">Admin View Active Restaurants</Link>

                </>
              ):(
                <>
                </>
              )}
              <button onClick={logout}>Logout </button>
            </>
          )}
        </div>

        <Routes>
          {!authState ? (
          <>
          {/* common */}
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/forget_pass" element={<ForgetPass />}></Route>
          <Route path="/register_restaurant" element={<RestaurantRegisterPage />}></Route>
          <Route path="/register_manager_cashier" element={<RegisterPageMC />}></Route>

            </>
          ):(
           <>
           {currentPermission == 1 ? (
             <>
             {/* customer */}
             <Route path="/change_pass" element={<ChangePass />}></Route>
             <Route path="/main_view_customer"element={<Main_Page_Customer />}></Route>
             <Route path="/track_order" element={<TrackOrder />}></Route>
             <Route path="/menu_items" element={<Menu />}></Route>

             </>
           ):(
             <>
             </>
            )}
            
            {currentPermission == 3 ? (
              <>
              {/* restaurant */}
              <Route path="/offer-a-deal" element={<OfferAdeal />}></Route>
              <Route path="/offer_discount" element={<OfferDiscount />}></Route>
              <Route path="/add_item" element={<AddItem />}></Route>
              <Route path="/remove_item" element={<DeleteItem />}></Route>
              <Route path="/edit_item" element={<EditItem />}></Route>
              <Route path="/item_in_stock" element={<ItemInStock />}></Route>
              <Route path="/item_out_stock" element={<ItemOutOfStock />}></Route>
              <Route path="/restaurant_main" element={<Restaurant />}></Route>
              <Route path="/delete_deal" element={<DeleteDeal />}></Route>
              <Route path="/edit_deal" element={<EditDeal />}></Route>
              <Route path="/rem_discount" element={<RemoveDiscount />}></Route>
              </>
            ):(
              <>
              </>
            )}

            {currentPermission == 4 ? (
              <>
              {/* Cashier */}
              <Route path="/accept_order" element={<AcceptOrder />}></Route>
              </>
            ):(
              <>
              </>
            )}

            {currentPermission == 5 ? (
              <>
            {/* admin */}
            <Route path="/admin_res_view" element={<AdminRestaurantView />}></Route>
            <Route path="/AdminViewComplaints" element={<AdminViewComplaints />}></Route>
            <Route path="/AdminViewCommission" element={<AdminViewCommission />}></Route>
            <Route path="/AdminResAddRem" element={<AdminResAddRem />}></Route>
            <Route path= "/AdminViewHistory" element={<AdminViewHistory/>}></Route>

              </>
            ):(
              <>
              </>
            )}
           </>
          )}
        </Routes>
      </Router>
      </setPermissionContext.Provider>
    </authContext.Provider>
  );
}

export default App;
