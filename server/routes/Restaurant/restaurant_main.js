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
            res.json({error:err});
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
            res.json({error:err});
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
            res.json({error:err});
        }
    })
    res.end("Store opened");
})

//AddItem
router.post("/AddItem", validate_token, async(req,res)=>{
    const body = req.body;
    var sql = "INSERT INTO items (name,price) VALUES (?,?)";
    connection.query(sql,[body.name,body.price], function(err,row,fields){
        if(err){
            res.json({error:err});
        }
    })
    res.end("Item added");
})

//Edit Item
router.post("/EditItem", validate_token, async(req,res)=>{
    const body = req.body;
    var sql = "UPDATE items SET (?) = (?) WHERE name = (?)";
    connection.query(sql,[body.attribute, body.value, body.name], function(err,row,fields){
        if(err){
            res.json({error:err});
        }
    })
    res.end(body.attribute.concat(" updated"));
})

//Delete Item
router.post("/DeleteItem", validate_token, async(req,res)=>{
    const body = req.body;
    var sql = "DELETE from items WHERE name = (?)";

    connection.query(sql,[body.name], function(err,row,fields){
        if(err){
            res.json({error:err});
        }
    })
    res.end("item deleted");
})

//Mark an item as out of stock (NOTE PLEASE ADD COUNT TO TABLE)
router.post("/ItemFinish", validate_token, async(req,res)=>{
    var sql = "UPDATE items SET count = 0 WHERE name = (?)"; //count is a binary attribute which shows in stock or out of stock
    connection.query(sql,[body.name], function(err,row,fields){
        if(err){
            res.json({error:err});
        }
    })
    res.end("Item is out of stock");
})

//Mark an item as in stock (NOTE PLEASE ADD COUNT TO TABLE)
router.post("/ItemAvailable", validate_token, async(req,res)=>{
    var sql = "UPDATE items SET count = 1 WHERE name = (?)"; //count is a binary attribute which shows in stock or out of stock
    connection.query(sql,[body.name], function(err,row,fields){
        if(err){
            res.json({error:err});
        }
    })
    res.end("Item is in stock");
})

module.exports = router;