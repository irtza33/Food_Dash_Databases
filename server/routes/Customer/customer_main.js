const { response } = require('express');
const express = require('express');
const mysql = require('mysql2')
const router = express.Router()
const config = require('../../Config/config')
const {validation_token, validate_token}=require('../../middleware/auth_middleware')
const connection=config.connection


router.get('/',validate_token,async (req,res)=>{

    res.send("Hey You are logged in!")
})



//Orders//

router.post("/place_order",validate_token, (req,res)=>{
    //Change customer name to decode from token
    const {restaurant_name,customer_name,order_status,order_price,order_quantity}=req.body

    
    let sql_query = "SELECT restaurant_id FROM restaurant WHERE restaurant_name = (?)"
    connection.query(sql_query,restaurant_name,function(err,row,feilds){
        if(err){
            res.json({error:err})
        }else if (!row.length){
            res.json({error:"Restaurant Not found!"})
        }else{
            res_id=row[0].restaurant_id
            sql_query = "SELECT account_ID FROM accounts WHERE user_name = (?)"
            connection.query(sql_query,customer_name,function(err,row,feilds){
                if(err){
                    res.json({error:err})
                }else if (!row.length){
                    res.json({error:"Customer Not found!"})
                }else{
                    cust_id=(row[0].account_ID)
                    var price = order_price * order_quantity
                    sql_query = "SELECT MAX(order_id) as id from orders"
                    connection.query(sql_query,function(err,row,feilds){
                        if(err){
                            res.json({error:err})
                        }else if (!row.length){
                            res.json({error:"Customer Not found!"})
                        }else{
                            current_id=row[0].id
                            if(current_id==null){
                                current_id=1
                            }else{
                                current_id=current_id+1
                            }
                            sql_query="INSERT into orders VALUES(?,?,?,?,?,NOW())"
                            connection.query(sql_query,[current_id,res_id,cust_id,order_status,price],function(err,row,feilds){
                                if(err){
                                    res.json({error:err})
                                }else {
                                    res.json({order_id:current_id})
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

router.get("/track_order",validate_token ,(req,res)=>{
    const {order_id} =req.body

    let sql_query = "SELECT current_status FROM orders WHERE order_id = (?)"
    connection.query(sql_query,order_id,function(err,row,feilds){
        if(err){
            res.json({error:err})
        }else if (!row.length){
            res.json({error:"Order not found!"})
        }else{
            res.json(row[0].current_status)
        }
    })
})

router.post('/cancel_order',validate_token,(req,res)=>{
    const body = req.body
    
    let sql_query = "SELECT * FROM orders WHERE order_id = (?)"
    connection.query(sql_query,body.order_id,function(err,row,feilds){
        if(err){
            console.log(err)
        }else if(!row.length){
            res.json({error:"Order not found!"})
        }else{
            sql_query = "DELETE FROM orders WHERE order_id = (?)"
            connection.query(sql_query,body.order_id,function(err,row,feilds){
                if(err){
                    console.log(err)
                }else{
                    res.json({data:"Item Deleted!"})
                }
            })
        }
    })
})




//Complaint

router.post("/post_complaint",(req,res)=>{
    const {user_name,restaurant_name,complaint_text}=req.body

    let sql_query="INSERT INTO complaints (customer_id,restaurant_id,complaint_text) VALUES ((SELECT customer_id FROM customer WHERE customer_name = ?),(SELECT restaurant_id FROM restaurant WHERE restaurant_name = ?),?)"
    
    connection.query(sql_query,[user_name,restaurant_name,complaint_text],function(err,row,feild){
        if(err){
            res.json({error:err})
        }else{
            res.json({data:"Complaint Registered!"})
        }
    })

})
module.exports=router