const { response, application } = require("express");
const express = require("express");
const mysql = require("mysql2");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcrypt");
const router = express.Router();
const config = require("../../Config/config");
const { validate_token } = require("../../middleware/auth_middleware");
const { sign } = require("jsonwebtoken");
const connection = config.connection;

var counter = 0;

router.post("/", async (request, response) => {
  connection.query(
    "SELECT MAX(account_id) as max_id from accounts",
    function (err, row, feilds) {
      counter = row[0].max_id;
      if (counter == null) {
        counter = 0;
      }
      const body = request.body;
      user_type = body.userType;
      var sql_query = "INSERT INTO accounts VALUES(?,?,?,?,?)";
      counter = counter + 1;
      bcrypt.hash(body.password, 10).then((hash) => {
        connection.query(
          sql_query,
          [counter, body.username, hash, hash, user_type],
          function (err, row, fields) {
            if (err) {
              response.json({ error: err });
            } else {
              sql_query = "INSERT INTO admin VALUES (?,?,?,?,?)";
              connection.query(
                sql_query,
                [counter, body.username, body.address, body.email, body.number],
                function (err, row, feilds) {
                  if (err) {
                    response.json({ error: err });
                  }
                }
              );
            }
          }
        );
      });
      response.json({ data: "Admin account created" });
    }
  );
});

router.post("/login", async (request, response) => {
  const body = request.body;
  user_type = body.userType;
  if (user_type != 5) {
    response.json({ error: "This is Admin Login! Try other login" });
    return;
  }
  var sql_query = "SELECT * FROM accounts WHERE user_name=(?)";
  connection.query(sql_query, [body.username], function (err, row, fields) {
    if (err) {
      response.json({ error: err });
    } else if (!row.length) {
      response.json({ error: "Username does not exist" });
    } else {
      bcrypt.compare(body.password, row[0].current_password).then((match) => {
        if (!match) {
          response.json({ error: "Wrong username and password combination!" });
        } else {
          console.log(row)
          const user_id = row[0].account_ID;
          const accessToken = sign(
            { username: body.username, id: user_id },
            "Databases@Lums"
          );
          response.json({
            accessToken: accessToken,
            account_type: row[0].permissions,
          });
        }
      });
    }
  });
});

//Add Restaurant
router.post("/AddR", validate_token, async (req, res) => {
  connection.query(
    "SELECT MAX(restaurant_id) as max_id from restaurant",
    function (err, row, feilds) {
      counter = row[0].max_id;
      if (counter == null) {
        counter = 0;
      }
      const body = req.body;
      var sql = "INSERT INTO restaurant VALUES (?,?,?,?,?,?,?,?,?";
      connection.query(
        sql,
        [
          counter,
          body.name,
          body.address,
          body.area,
          body.phone,
          body.cuisine,
          body.manager,
          body.cashier,
          body.open,
        ],
        function (err, row, fields) {
          if (err) {
            res.json({ error: err });
          }
        }
      );
    }
  );
  res.json({ data: "Restaruant Added" });
});

//Verify Restaurant
router.post("/verify_res", validate_token, async (req, res) => {
  const { id } = req.body;
  let sql_query =
    "UPDATE restaurant SET verified = (?) WHERE restaurant_id = (?)";
  connection.query(sql_query, ["1", id], function (err, row, feilds) {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ data: "Restaurant Verified!" });
    }
  });
});

router.post("/show_pending", validate_token, async (req, res) => {
  let sql_query = "SELECT * from restaurant WHERE verified= 0";
  connection.query(sql_query, [], function (err, row, feilds) {
    if (err) {
      res.json(err);
    } else {
      res.json({ data: row });
    }
  });
});

//Remove Restaurant
router.post("/DeleteR", validate_token, async (req, res) => {
  const body = req.body;
  var sql = "DELETE FROM restaurant WHERE restaurant_name = (?)";
  connection.query(sql, [body.restaurant_name], function (err, row, fields) {
    if (err) {
      console.log(err);
      res.json({ error: err });
    } else {
      res.json({ data: "Removed!" });
    }
  });
});

//View all restaurants
router.post("/ViewR", validate_token, async (req, res) => {
  var sql = "SELECT name FROM restaurant";
  connection.query(sql, function (err, row, fields) {
    if (err) {
      res.json({ error: err });
    } else if (!row.length) {
      res.json({ error: "No restaurants to view" });
    } else {
      res.json({ rows: row });
    }
  });
});

//View Order history
router.post("/OrderHist", validate_token, async (req, res) => {
  const body = req.body;
  var sql =
    "SELECT I.item_name,O.current_status,O.order_placed_time,O.order_delivered_time, OD.qty, O.total_bill FROM order AS O, order_Details as OD, items as I WHERE O.restaurant_id IN ( \
        SELECT restaurant_id FROM restaurant WHERE name = (?))";
  connection.query(sql, [body.name], function (err, row, fields) {
    if (err) {
      res.json({ error: err });
    } else if (!row.length) {
      res.json({ error: "No order history for this retaurant exists!" });
    } else {
      res.json({ rows: row });
    }
  });
});


router.post('/getOrders',validate_token,async(req,res)=>{
  const {restaurant_id}=req.body;
  let sql_query="SELECT * FROM orders WHERE restaurant_id = (?)"
  connection.query(sql_query,[restaurant_id],function(err,row,fields){
    if(err){
      res.json({error:err})
    }else{
      res.json({data:row})
    }
  })

})
router.post("/getCommission", validate_token, async (req, res) => {
  const { restaurant_name } = req.body;

  let sql_query =
    "SELECT SUM(total_bill) as money FROM orders WHERE restaurant_id in (SELECT restaurant_id from restaurant where restaurant_name = ?)";
  connection.query(sql_query, restaurant_name, function (err, row, feild) {
    if (err) {
      res.json({ error: err });
    } else if (!row.length) {
      res.json({ error: "No Restaurant found" });
    } else {
      item = row[0].money;
      item = 0.2 * item;
      res.json({ data: item });
    }
  });
});

router.post("/get_complaints", async (req, res) => {
  const body = req.body;
  let sql_query =
    "SELECT * FROM complaints WHERE restaurant_id = (?)";
  connection.query(
    sql_query,
    [body.restaurant_name],
    function (err, row, feilds) {
      if (err) {
        res.json({ error: err });
      } else {
        res.json({ data: row });
      }
    }
  );
});
module.exports = router;
