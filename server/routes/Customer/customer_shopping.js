const { response } = require("express");
const express = require("express");
const mysql = require("mysql2");
const jwt_decode = require("jwt-decode");
const router = express.Router();
const config = require("../../Config/config");
const {
  validation_token,
  validate_token,
} = require("../../middleware/auth_middleware");
const connection = config.connection;


router.post("/getBill",validate_token,async(req,res)=>{
    const {item_id}=req.body;

    let sql_query="SELECT price FROM items where item_id = (?)"
    connection.query(sql_query,[item_id],function(err,row,feilds){
        if(err){
            res.json({error:err})
        }else{
            res.json({data:row[0].price})
        }
    })
})

router.post("/setOrder",validate_token,async(req,res)=>{
    let accessToken = req.header("accessToken");
    let decoded_value = jwt_decode(accessToken);
    const{restaurant_id,totalBill,status}=req.body
    let sql_query ="INSERT INTO orders (restaurant_id,customer_id,current_status,total_bill,order_placed_time) VALUES(?,?,?,?,NOW())"
    connection.query(sql_query,[restaurant_id,decoded_value.id,status,totalBill],function(err,row,feild){
        if(err){
            res.json({error:err})
        }else{  
            let x = row.insertId
            res.json({data:"Order Placed",order_id:x})
        }
    })
})

router.post("/setOrderItem",validate_token,async(req,res)=>{
    const{order_id,item_id,qty}=req.body

})


module.exports = router