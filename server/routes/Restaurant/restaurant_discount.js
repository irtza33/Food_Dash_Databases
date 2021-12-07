const express = require('express');
const mysql = require('mysql2')
const router = express.Router()
const config = require('../../Config/config')
const connection=config.connection
const bcrypt=require('bcrypt')
count = 0



router.post("/discount/create",(req,res)=>{
    const {item_id,restaurant_name,percent_disc,price_after,status}=req.body

    let sql_query= "INSERT INTO discounts VALUES (?,(SELECT restaurant_id FROM restaurant WHERE restaurant_name= ? ),?,?,?)"

    connection.query(sql_query,[item_id,restaurant_name,percent_disc,price_after,status],function(err,row,fields){
        if(err){
            res.json({error:err})
        }else{
            res.json({data:"Discount created!"})
        }
    })
})


router.post("/discount/remove",(req,res)=>{
    const {item_id,restaurant_name}=req.body
    let sql_query="DELETE FROM discounts WHERE restaurant_id =(SELECT restaurant_id FROM restaurant WHERE restaurant_name= ?) AND item_id = (?)"
    connection.query(sql_query,[restaurant_name,item_id],function(err,row,feilds){
        if(err){
            res.json({error:err})
        }else{
            res.json({data:"Discount removed"})
        }
    })
})
module.exports=router