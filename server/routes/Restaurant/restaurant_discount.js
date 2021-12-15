const express = require('express');
const mysql = require('mysql2')
const jwt_decode = require("jwt-decode");
const router = express.Router()
const config = require('../../Config/config')
const connection=config.connection
const bcrypt=require('bcrypt');
const { validate_token } = require('../../middleware/auth_middleware');
const { json } = require('body-parser');
count = 0



router.post("/offer_discount", async (req, res) => {
    const body = req.body;  
    let accessToken = req.header("accessToken");
    console.log(body);
    let decoded_value = jwt_decode(accessToken);
    let res_id = decoded_value.id
    console.log(decoded_value);
    //Update menu items as well
    var sql = "INSERT INTO discounts VALUES(?,?,?,1)";
    // console.log("EBAD",body.item_id, decoded_value.id ,body.price)
    connection.query(
      sql,
      [body.item_id, res_id,body.price_after,1],
      function (err, row, fields) {
        if (err) {
          console.log("No such item exists!");
          res.json({ error: err });
        } else {
          var sql2 =
              "UPDATE menu_items SET price = ? WHERE item_id = ?";
          connection.query(
            sql2,
            [body.price_after, body.item_id],
            function (err, rows, fields) {
              if (err) { 
                console.log(err);
                res.json({error:err})
              } else {
                console.log("DONE!");
                res.json({data:"Discount Applied"})

              }
            }
          );
          console.log(body);
        }
      }
    );
  });


  router.post("/remove_discount", async (req, res) => {
    const body = req.body;  
    let accessToken = req.header("accessToken");
    console.log(body);
    let decoded_value = jwt_decode(accessToken);
    let res_id = decoded_value.id
    // console.log(decoded_value);
    //Update menu items as well
    var sql = "DELETE FROM  discounts WHERE item_id = ?";
    // console.log("EBAD",body.item_id, decoded_value.id ,body.price)
    connection.query(
      sql,
      body.item_id,
      function (err, row, fields) {
        if (err) {
          console.log("No such item exists!");
          res.json({ error: err });
        } else {
          var sql2 = "SELECT price from items where item_id = ?"
          connection.query(sql2, body.item_id,
            function(err,rows,fields){
              if (err)
              {
                console.log(err);
              }
              else
              {
                var sql3 = "UPDATE menu_items SET price = ? where item_id = ?";
                connection.query(sql3, [rows[0].price, body.item_id],
                function(err,rows,fields){
                  if (err)
                  {
                    console.log(err)
                  }
                  else
                  {
                    console.log("DONE!");
                    res.json({"data":"Discount deleted"})
                  }
                })
              }
            })
          // var sql2 =
          //     "UPDATE menu_items SET price = ? WHERE item_id = ?";
          // connection.query(
          //   sql2,
          //   [body.price_after, body.item_id],
          //   function (err, rows, fields) {
          //     if (err) { 
          //       console.log(err);
          //     } else {
          //       console.log("DONE!");
          //     }
          //   }
          // );
          // console.log(body);
        }
      }
    );
  });
module.exports=router