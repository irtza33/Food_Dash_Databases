const { response } = require('express');
const express = require('express');
const mysql = require('mysql2');
const jwt_decode = require("jwt-decode");
const router = express.Router();
const config = require('../../Config/config');
const { validate_token } = require('../../middleware/auth_middleware');
const connection=config.connection;

counter = 0;

connection.query("SELECT MAX(restaurant_id) as max_id from restaurant",function(err,row,feilds){
    counter=row[0].max_id
    if(counter==null){
        counter=0
    }
})

//Add Restaurant
router.post("/AddR", validate_token, async(req,res)=>{
    const body = req.body;
    var sql = "INSERT INTO restaurant VALUES (?,?,?,?,?,?,?,?,?";
    connection.query(sql,[counter,body.name,body.address,body.area,body.phone,body.cuisine,body.manager,body.cashier,body.open], function(err,row,fields){
        if(err){
            res.json({error:err});
        }

    })
    res.end("Restaurant added");
})

//Remove Restaurant
router.post("/DeleteR", validate_token, async(req,res)=>{
    const body = req.body;
    var sql = "DELETE FROM restaurant WHERE name = (?)";
    connection.query(sql,[body.name], function(err,row,fields){
        if(err){
            res.json({error:err});
        }

    })
    res.end("Restaurant Removed");
})

//View all restaurants
router.post("/ViewR", validate_token, async(req,res)=>{
    var sql = "SELECT name FROM restaurant";
    connection.query(sql, function(err,row,fields){
        if(err){
            res.json({error:err});
        }
        else if (!row.length){
            res.json({error:"No restaurants to view"})
        }
        else {
            res.json({rows:row});
        }
    })
})

//View Order history
router.post("/OrderHist", validate_token, async(req,res)=>{
    const body = req.body;
    var sql = "SELECT I.name,O.status,O.order_placed_time,O.order_delivered_time, OD.qty, O.total_bill FROM order AS O, order_Details as OD, items as I WHERE O.restaurant_id IN ( \
        SELECT restaurant_id FROM restaurant WHERE name = (?))";
        connection.query(sql, [body.name], function(err,row,fields){
            if(err){
                res.json({error:err});
            }
            else if(!row.length){
                res.json({error:"No order history for this retaurant exists!"});
            }
            else {
                res.json({rows:row});
            }
        });

})

module.exports = router;