import React from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"


import LoginPage from "./components/Login_page/login";
import RegisterPage from './components/Register/Register_Page';



function App() {
  return (
    <Router>
      <div>
        <Link style={{padding:5}} to='/'>Home</Link>
        <Link style={{padding:5}} to='/login'>Login</Link>
        <Link style={{padding:5}} to='/register'>Register</Link>
      </div>

      <Routes>
        <Route path="/login" element={ <LoginPage/>}></Route>
        <Route path="/register" element={<RegisterPage/>}></Route>
      </Routes>

    </Router>
  );
}

export default App;
