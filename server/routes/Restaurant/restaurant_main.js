const { response } = require('express');
const express = require('express');
const mysql = require('mysql2');
const jwt_decode = require("jwt-decode");
const router = express.Router();
const config = require('../../Config/config');
const { validate_token } = require('../../middleware/auth_middleware');
const connection=config.connection;

//Change Phone Number
router.post("/Cphone",validate_token, async(req,res)=>{
    const body = req.body;
    var sql = "UPDATE restaurant SET phone_number = (?) WHERE name =(?)";
    let accessToken = req.header("accessToken");
    let decoded_value = jwt_decode(accessToken);
    connection.query(sql,[body.phone_number, decoded_value.username],function(err,row,fields){
        if(err){
            console.log(err)
        }
    })
    
    res.end("Phone number changed successfully");
})

//Open Store
router.post("/OpStore", validate_token, async(req,res)=>{
    var sql = "UPDATE restaurant SET open_status = (?) WHERE name = (?)";
    let accessToken = req.header("accessToken");
    let decoded_value = jwt_decode(accessToken);
    connection.query(sql,[1, decoded_value.username], function(err,row, fields){
        if(err){
            console.log(err);
        }
    })
    res.end("Store opened");
})

//Close Store
router.post("/ClStore", validate_token, async(req,res)=>{
    var sql = "UPDATE restaurant SET open_status = (?) WHERE name = (?)";
    let accessToken = req.header("accessToken");
    let decoded_value = jwt_decode(accessToken);
    connection.query(sql,[0, decoded_value.username], function(err,row, fields){
        if(err){
            console.log(err);
        }
    })
    res.end("Store opened");
})

//AddItem
router.post("/AddItem", validate_token, async(req,res)=>{
    const body = req.body;
    var sql = "INSERT INTO items (name,price) VALUES (?,?)";
    connection.query(sql,[body.item_name,body.price], function(err,row,fields){
        if(err){
            console.log(err);
        }
    })
    res.end("Item added");
})