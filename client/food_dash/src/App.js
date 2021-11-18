import React from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"


import LoginPage from "./components/Login_page/login";
import RegisterPage from './components/Register/Register_Page';
import ForgetPass from './components/ForgetPassword/forget_pass';
import ChangePass from './components/ChangePassword/Change_Pass';


function App() {
  return (
    <Router>
      <div>
        <Link style={{padding:5}} to='/'>Home</Link>
        <Link style={{padding:5}} to='/login'>Login</Link>
        <Link style={{padding:5}} to='/register'>Register</Link>
        <Link style={{padding:5}} to='/forget_pass'>Forget Password</Link>
        <Link style={{padding:5}} to='/change_pass'>Change Password</Link>
      </div>

      <Routes>
        <Route path="/login" element={ <LoginPage/>}></Route>
        <Route path="/register" element={<RegisterPage/>}></Route>
        <Route path="/change_pass" element={<ChangePass/>}></Route>
        <Route path="/forget_pass" element={<ForgetPass/>}></Route>
      </Routes>

    </Router>
  );
}

export default App;
