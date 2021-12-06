const { response } = require('express');
const express = require('express');
const mysql = require('mysql2');
const jwt_decode = require("jwt-decode");
const router = express.Router();
const config = require('../../Config/config');
const { validate_token } = require('../../middleware/auth_middleware');
const bcrypt=require('bcrypt')
const connection=config.connection;

//Forgot Password
router.post("/Fpass", async(req,res) => {
    const body = req.body;
    var sql = "UPDATE accounts SET current_password = (?) WHERE user_name = (?)";
    bcrypt.hash(body.password,10).then((hash)=>{
        connection.query(sql,[hash, body.username],function(err,row,fields){
            if(err){
                console.log(err)
            }else{
                res.json()
            }
        })
    })
    res.json({data:"Password Changed!"});
})

//Change Password
router.post("/Cpass",validate_token, async(req,res)=> {
    const body = req.body;
    let accessToken = req.header("accessToken");
    let decoded_value = jwt_decode(accessToken);
    var sql = "UPDATE accounts SET current_password = (?) WHERE user_name = (?)";
    bcrypt.hash(body.password,10).then((hash)=>{
        connection.query(sql,[hash, decoded_value.username],function(err,row,fields){
            if(err){
                console.log(err)
            }
        })
    })
    res.end("Password changed successfully");
})


module.exports=router