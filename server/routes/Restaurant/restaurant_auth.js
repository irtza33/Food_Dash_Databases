const express = require('express');
const mysql = require('mysql2')
const router = express.Router()
const config = require('../../Config/config')
const connection=config.connection
const bcrypt=require('bcrypt')

const {sign}= require('jsonwebtoken')
var counter=0

connection.query("SELECT MAX(account_id) as max_id from accounts",function(err,row,feilds){
    counter=row[0].max_id
    if(counter==null){
        counter=0
    }
})
  

//Register
router.post("/",async (request,response)=>{
    //Need Manager and Cashier Username as well
    const body = request.body
    var sql_query="INSERT INTO accounts VALUES(?,?,?,?,?)"
    counter=counter+1 
    bcrypt.hash(body.password,10).then((hash)=>{
        connection.query(sql_query,[counter,body.username,hash,hash,2],function(err,row,fields){
            if(err){
              response.json({error:err});
            }else{
                sql_query = "INSERT INTO restaurant VALUES(?,?,?,?,?,?,(SELECT account_ID FROM accounts where user_name = ?),(SELECT account_ID FROM accounts where user_name = ?),1)"
                connection.query(sql_query,[counter,body.username,body.address,body.area,body.cuisine,body.number,body.manager_name,body.cashier_name,body.open_status])
                if(err){
                    response.json({err:err})
                }
            }
        })
    })
    response.json({data:"Restaurant Created"})
})


//Login Auth
router.post("/login",async (request,response)=>{
    const body=request.body
    user_type = body.user_type

    if(user_type != 2){
        response.json({error:"This is restaurant Login! Try other login"})
        return
    }
    var sql_query="SELECT * FROM accounts WHERE user_name=(?)"
    connection.query(sql_query,[body.username],function(err,row,fields){
      if(err){
        response.json({error:err});
      }else if (!row.length){
        response.json({error: "Username does not exist"})
      }else{
        bcrypt.compare(body.password,row[0].current_password).then((match)=>{

            if (!match){  
              response.json({error:"Wrong username and password combination!"})
            }else{
              const user_id = row[0].account_id
              const accessToken = sign({username: body.username, id:user_id},"Databases@Lums")

              response.json({accessToken:accessToken,account_type:row[0].permissions})
            }
        })
      }
    })
  
})
  

module.exports=router