const { response } = require('express');
const express = require('express');
const mysql = require('mysql2');
const jwt_decode = require("jwt-decode");
const router = express.Router();
const config = require('../../Config/config');
const { validate_token } = require('../../middleware/auth_middleware');
const connection=config.connection;

deal_count = 0;

connection.query("SELECT MAX(deal_id) as max_id from deal",function(err,row,feilds){
    deal_count=row[0].max_id
    if(deal_count==null){
        deal_count=0
    }
})

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

//Offer a Deal
router.post("/PostDeal", validate_token, async(req,res)=>{
    const body = req.body;
    var sql1 = "INSERT INTO deal VALUES (?,?,?,?)";
    let accessToken = req.header("accessToken");
    let decoded_value = jwt_decode(accessToken);
    connection.query(sql1,[deal_count, body.deal_name, body.deal_price,1], function(err,row,fields){
        if(err){
            res.json({error:err});
        }
    });
    var sql2 = "INSERT INTO Deal_items VALUES (?,?,?,?)";
    var sql3 = "SELECT account_id FROM accounts WHERE user_name = (?)";
    var your_id = ""
    connection.query(sql3,[decoded_value.username], function(err,row,fields){
        if(err){
            res.json({error:err});
        }
        else if (row.length){
            your_id = row[0]; //Extracted ID from table
        }
    })
    for(let i = 0; i < body.num; i++){
        connection.query(sql2,[deal_count,your_id, body.item_id[i], body.quant], function(err,row,fields){
            if(err){
                res.json({error:err});
            }
        })
    }
    res.end("Deal added!");
})

//Edit a deal
router.post("/EditDeal", validate_token, async(rerq,res)=>{ //only changes price of deal
    const body = req.body;
    var sql = "UPDATE deal SET price = (?) WHERE name = (?)";
    connection.query(sql, [body.price, body.name], function(err,row,fields){
        if(err){
            res.json({error:err});
        }
    })
    res.end("Deal updated");
})

//Delete Deal
router.post("/DeleteDeal", validate_token, async(req,res)=>{
    const body = req.body;
    var sql = "DELETE FROM Deal_items WHERE deal_id = (?)";
    var dID = "";
    var pull = "SELECT deal_id FROM deal WHERE name = (?)";
    connection.query(pull,[body.name],function(err,row,fields){
        if(err){
            res.json({error:err});
        }
        dID = row[0];
    })
    connection.query(sql,[dID],function(err,row,fields){
        if(err){
            res.json({error:err});
        }
    })
    connection.query("DELETE FROM deal WHERE deal_id = (?)",[dID],function(err,row,fields){
        if(err){
            res.json({error:err});
        }
    })
    res.end("Deal Deleted");
})

//Accepting Order
router.post("/AcceptOrder", validate_token, async(req,res)=>{
    const body = req.body;
    var sql = "UPDATE order SET status = (?) WHERE order_id = (?)";
    connection.query(sql,[body.AcceptReject, body.ID], function(err, row, fields){ //Receive Order ID in body that will be accepted. Accept Reject has var char of either accept or reject
        if(err){
            res.json({error:err});
        }
    })
    res.end("Order ".concat(body.AcceptReject));

})

//Fulfill order
router.post("/ChangeStatus", validate_token, async(req,res)=>{
    const body = req.body;
    var sql = "UPDATE order SET status = 'Fulfilled' WHERE order_id = (?)";
    connection.query(sql,[body.ID], function(err, row, fields){
        if(err){
            res.json({error:err});
        }
    })
    res.end("Order Fulfilled");
})


module.exports = router;