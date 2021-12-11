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

// 1--> Customer
// 2--> Restaurant
// 3--> Manager
// 4--> Cashier

//Register
router.post("/",async (request,response)=>{
    const body = request.body
    user_type = body.user_type
    var sql_query="INSERT INTO accounts VALUES(?,?,?,?,?)"
    counter=counter+1 
    console.log(counter)
    bcrypt.hash(body.password,10).then((hash)=>{
        connection.query(sql_query,[counter,body.username,hash,hash,user_type],function(err,row,fields){
            if(err){
              response.json({error:err});
            }else{
              //Customer
              if(user_type==1){
                sql_query="INSERT INTO customer VALUES(?,?,?,?,?,?,?,?,?,?)"
                connection.query(sql_query,[counter,body.username,body.address,body.area,body.email,body.number,body.dob,body.bank_number,body.cvv,body.expiry],function(err,row,fields){
                  if(err){
                    response.json({error:err})
                  }
                })
              }
              //Manager
              if(user_type==3){
                sql_query="INSERT INTO MANAGER VALUES(?,?,?,?,?)"
                connection.query(sql_query,[counter,body.username,body.address,body.email,body.number],function(err,row,feilds){
                  if(err){
                    response.json({error:err})
                  }
                })
              }
              //Cashier
              if(user_type==4){
                sql_query="INSERT INTO cashier VALUES (?,?,?,?,?)"
                connection.query(sql_query,[counter,body.username,body.address,body.email,body.number],function(err,row,feilds){
                  if(err){
                    response.json({error:err})
                  }
                })
              }
            }
        })
    })
    response.json({data:"User Created"})
})


//Login Auth
router.post("/login",async (request,response)=>{
    const body=request.body

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
  
// For Every page that has restricted access. 
//Header file mey sirf token pass kerna hai.

module.exports=router