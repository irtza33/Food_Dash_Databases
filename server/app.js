var express = require('express');
var cors = require("cors");
var mysql =require('mysql2')
const router = express.Router();
var app = express();
app.use("/",router)
app.use(express.json())
app.use(cors());



//Routes

//Auth
const Customer_Register = require('./routes/Customer/customer_auth')
app.use("/auth",Customer_Register);


//Restaurant
const Restaurant_Register = require('./routes/Restaurant/restaurant_auth')
app.use("/auth/res",Restaurant_Register)


//Restaurant Discounts
const Rest_disc= require('./routes/Restaurant/restaurant_discount')
app.use("/res_disc/",Rest_disc)


//Main Page Customer
const Customer_Main = require('./routes/Customer/customer_main')
app.use("/main_view",Customer_Main);


const Common_Func = require('./routes/Common/common')
app.use("/Common",Common_Func)

const Admin_Func = require('./routes/Admin/admin')
app.use("/admin",Admin_Func)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

