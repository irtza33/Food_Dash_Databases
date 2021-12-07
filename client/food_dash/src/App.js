import React from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"

import {authContext} from './Helper/authContext'
import { useState,useEffect } from 'react';

import LoginPage from "./components/Login_page/login";
import RegisterPage from './components/Register/Register_Page';
import ForgetPass from './components/ForgetPassword/forget_pass';
import ChangePass from './components/ChangePassword/Change_Pass';
import Main_Page_Customer from './components/Main_Customer_Page/main_page_customer';

function App() {
  const [authState,setAuthState]=useState(false)

  useEffect(()=>{
    if(localStorage.getItem("accessToken")){
      setAuthState(true)
    }
  },[])

  const logout=()=>{
    localStorage.removeItem("accessToken");
    setAuthState(false)
  }

  return (
    <authContext.Provider value={{authState,setAuthState}} >
    <Router>
      <div>
        <Link style={{padding:5}} to='/'>Home</Link>
        {!authState ? (
          <>
            <Link style={{padding:5}} to='/login'>Login</Link>
            <Link style={{padding:5}} to='/register'>Register</Link>
          </>
        ):(
          <>
            <Link style={{padding:5}} to='/forget_pass'>Forget Password</Link>
            <Link style={{padding:5}} to='/change_pass'>Change Password</Link>
            <Link style={{padding:5}} to='/main_view_customer'>Customer Page</Link>
            <button onClick={logout}>Logout </button>
          </>
        )}

      </div>

      <Routes>
        <Route path="/login" element={ <LoginPage/>}></Route>
        <Route path="/register" element={<RegisterPage/>}></Route>
        <Route path="/change_pass" element={<ChangePass/>}></Route>
        <Route path="/forget_pass" element={<ForgetPass/>}></Route>
        <Route path="/main_view_customer" element={<Main_Page_Customer/>}></Route>
      </Routes>

    </Router>
    </authContext.Provider >
  );
}

export default App;
