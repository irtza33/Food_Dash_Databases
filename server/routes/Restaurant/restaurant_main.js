const { response } = require("express");
const express = require("express");
const mysql = require("mysql2");
const jwt_decode = require("jwt-decode");
const router = express.Router();
const config = require("../../Config/config");
const { validate_token } = require("../../middleware/auth_middleware");
const e = require("express");
const { decode } = require("jsonwebtoken");
const connection = config.connection;

//deal_count = 0;

// connection.query("SELECT MAX(deal_id) as max_id from deal",function(err,row,feilds){
//     deal_count=row[0].max_id
//     if(deal_count==null){
//         deal_count=0
//     }
// })

//Change Phone Number
router.post("/Cphone", validate_token, async (req, res) => {
  const body = req.body;
  var sql = "UPDATE restaurant SET phone_num = (?) WHERE restaurant_id =(?)";
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  console.log(decoded_value);
  connection.query(
    sql,
    [body.phone_number, decoded_value.id],
    function (err, row, fields) {
      if (err) {
        res.json({ error: "Error" });
      } else {
        res.json({ data: "Phone number changed!" });
      }
    }
  );
});

//Open Store
router.post("/OpStore", validate_token, async (req, res) => {
  var sql = "UPDATE restaurant SET open_status = (?) WHERE name = (?)";
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  connection.query(
    sql,
    [1, decoded_value.username],
    function (err, row, fields) {
      if (err) {
        res.json({ error: err });
      }
    }
  );
});

//Close Store
router.post("/ClStore", validate_token, async (req, res) => {
  var sql = "UPDATE restaurant SET open_status = (?) WHERE name = (?)";
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  connection.query(
    sql,
    [0, decoded_value.username],
    function (err, row, fields) {
      if (err) {
        res.json({ error: err });
      }
    }
  );
});

//AddItem
router.post("/AddItem", validate_token, async (req, res) => {
  const body = req.body;
  console.log(body);

  let accessToken = req.header("accessToken");
  //let accessToken=req.body.headers.accessToken
  let decoded_value = jwt_decode(accessToken);
  let res_name = decoded_value.username;
  let res_id = decoded_value.id;
  console.log(decoded_value);

  var sql = "INSERT INTO items (item_name,price) VALUES (?,?)";
  connection.query(
    sql,
    [body.item_name, body.price],
    function (err, row, fields) {
      if (err) {
        res.json({ error: err });
      } else {
        console.log(row.insertId);
        var sql2 = "INSERT INTO menu_items VALUES (?,?,?,?,?,1,0)";
        connection.query(
          sql2,
          [row.insertId, res_id, body.item_name, body.category, body.price],
          function (err, rows, fields) {
            if (err) {
              console.log(res_id);
              res.json({ error: "Error inserting item!" });
            } else {
            }
          }
        );
      }
    }
  );
  //Need to edit query to insert into menu as well // done
});

//Edit Item
router.post("/EditItem", async (req, res) => {
  const body = req.body;
  console.log(body)
  console.log(req)
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  //Update menu items as well
  console.log(decoded_value)
  console.log("Hello")
  var sql = "UPDATE items SET item_name =? , price=? WHERE item_id = ?";
  connection.query(
    sql,
    [body.item_name, body.price, body.item_id],
    function (err, row, fields) {
      if (err) {
        console.log("No such item exists!");
        res.json({ error: err });
      } else {
        var sql2 =
          "UPDATE menu_items SET item_name=?, category=?, price=? WHERE item_id = (?)";
        connection.query(
          sql2,
          [body.item_name, body.category, body.price, body.item_id],
          function (err, rows, fields) {
            if (err) {
              console.log(err);
            } else {
              console.log("Item updated!");
            }
          }
        );
        console.log(body);
      }
    }
  );
});

//Delete Item
router.post("/DeleteItem", validate_token, async (req, res) => {
  const body = req.body;
  var sql = "DELETE from items WHERE item_id = (?)";

  connection.query(sql, [body.item_id], function (err, row, fields) {
    if (err) {
      res.json({ error: err });
    }
  });
  //res.end("item deleted");
  //to be deleted from menu items first
});

//Mark an item as out of stock (NOTE PLEASE ADD COUNT TO TABLE)
router.post("/ItemFinish", validate_token, async (req, res) => {
  //Note: Need to update menu as well
  const body = req.body;
  var sql = "UPDATE menu_items SET status = 0 WHERE item_id = (?)"; //count is a binary attribute which shows in stock or out of stock
  connection.query(sql, [body.item_id], function (err, row, fields) {
    if (err) {
      res.json({ error: err });
      console.log("Error");
    } else {
      console.log("item out of stock!");
    }
  });

  //res.end("Item is out of stock");
});

//Mark an item as in stock (NOTE PLEASE ADD COUNT TO TABLE)
router.post("/ItemAvailable", validate_token, async (req, res) => {
  //Note: Need to update menu as well
  const body = req.body;
  var sql = "UPDATE menu_items SET status = 1 WHERE item_id = (?)"; //count is a binary attribute which shows in stock or out of stock
  connection.query(sql, [body.item_id], function (err, row, fields) {
    if (err) {
      res.json({ error: err });
    }
  });
  //res.end("Item is in stock");
});

router.get("/get_menu_itemsB", validate_token, async (req, res) => {
  sql_query = "SELECT * FROM menu_items where restaurant_id = ? AND status=1";
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  const body = req.body;
  console.log(decoded_value.username);
  connection.query(
    "SELECT permissions FROM accounts where user_name = ?",
    [decoded_value.username],
    function (err, rows, fields) {
      if (err) {
        res.json({ error: "Error occured!" });
      } else {
        if (rows[0].permissions == 1) {
          connection.query(sql_query, [body.id], function (err, row, feilds) {
            if (err) {
              res.json({ error: "Error occured" });
            } else if (!row.length) {
              res.json({ error: "No items yet!" });
            } else {
              res.json({ data: row });
            }
          });
        } else {
          console.log(decoded_value.id);
          connection.query(
            sql_query,
            [decoded_value.id],
            function (err, row, feilds) {
              if (err) {
                res.json({ error: "Error occured" });
              } else if (!row.length) {
                res.json({ error: "No items yet!" });
              } else {
                res.json({ data: row });
              }
            }
          );
        }
      }
    }
  );
});

router.post("/get_menu_items", validate_token, async (req, res) => {
  sql_query = "SELECT * FROM menu_items where restaurant_id = ? AND status=1";
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  const body = req.body;
  console.log(decoded_value.username);
  connection.query(
    "SELECT permissions FROM accounts where user_name = ?",
    [decoded_value.username],
    function (err, rows, fields) {
      if (err) {
        res.json({ error: "Error occured!" });
      } else {
        if (rows[0].permissions == 1) {
          connection.query(sql_query, [body.id], function (err, row, feilds) {
            if (err) {
              res.json({ error: "Error occured" });
            } else if (!row.length) {
              res.json({ error: "No items yet!" });
            } else {
              res.json({ data: row });
            }
          });
        } else {
          console.log(decoded_value.id);
          connection.query(
            sql_query,
            [decoded_value.id],
            function (err, row, feilds) {
              if (err) {
                res.json({ error: "Error occured" });
              } else if (!row.length) {
                res.json({ error: "No items yet!" });
              } else {
                res.json({ data: row });
              }
            }
          );
        }
      }
    }
  );
});

router.post("/open_store", validate_token, async (req, res) => {
  sql_query = "UPDATE restaurant SET open_status = 1 where restaurant_id = ?";
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  const id = decoded_value.id;
  connection.query(sql_query, [id], function (err, row, fields) {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ data: "Restaurant opened!" });
    }
  });
});

router.post("/close_store", validate_token, async (req, res) => {
  sql_query = "UPDATE restaurant SET open_status = 0 where restaurant_id = ?";
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  const id = decoded_value.id;
  connection.query(sql_query, [id], function (err, row, fields) {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ data: "Restaurant opened!" });
    }
  });
});

//Accept Order
router.get("/view_order", validate_token, async (req, res) => {
  const body = req.body;
  var sql =
    "SELECT * FROM orders where restaurant_id = (SELECT restaurant_id FROM restaurant WHERE manager_id = (?))";
  //change manager_id to cashier_id
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);

  connection.query(sql, [decoded_value.id], function (err, row, fields) {
    if (err) {
      res.json({ error: "Error" });
    } else {
      res.json({ data: row });
    }
  });
});

router.post("/accept_order", validate_token, async (req, res) => {
  const body = req.body;
  //change manager_id to cashier_id
  var sql =
    "UPDATE orders SET current_status = 'Accepted' WHERE order_id = (?) AND restaurant_id = (SELECT restaurant_id FROM restaurant WHERE manager_id = (?))";

  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  console.log(body);

  connection.query(
    sql,
    [body.order_id, decoded_value.id],
    function (err, row, fields) {
      if (err) {
        res.json({ error: "No such order!" });
      } else {
        res.json({ data: row });
      }
    }
  );
});

router.post("/change_order_status", validate_token, async (req, res) => {
  const body = req.body;
  //change manager_id to cashier_id
  var sql =
    "UPDATE orders SET current_status = 'Enroute' WHERE order_id = (?) AND restaurant_id = (SELECT restaurant_id FROM restaurant WHERE manager_id = (?))";

  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  console.log(body);

  connection.query(
    sql,
    [body.order_id, decoded_value.id],
    function (err, row, fields) {
      if (err) {
        res.json({ error: "No such order!" });
      } else {
        res.json({ data: row });
      }
    }
  );
});

router.post("/order_delivered", validate_token, async (req, res) => {
  const body = req.body;
  //change manager_id to cashier_id
  var sql =
    "UPDATE orders SET current_status = 'Delivered' WHERE order_id = (?) AND restaurant_id = (SELECT restaurant_id FROM restaurant WHERE manager_id = (?))";

  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  console.log(body);

  connection.query(
    sql,
    [body.order_id, decoded_value.id],
    function (err, row, fields) {
      if (err) {
        res.json({ error: "No such order!" });
      } else {
        res.json({ data: row });
      }
    }
  );
});

router.get("/view_order_cust", validate_token, async (req, res) => {
  const body = req.body;
  var sql =
    "SELECT * FROM orders where customer_id = (?) ORDER BY order_placed_time DESC";
  //change manager_id to cashier_id
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);

  connection.query(sql, [decoded_value.id], function (err, row, fields) {
    if (err) {
      res.json({ error: "Error" });
    } else {
      res.json({ data: row });
    }
  });
});

router.post("/track_order", validate_token, async (req, res) => {
  const body = req.body;
  var sql = "SELECT current_status FROM orders where order_id = (?) ";
  //change manager_id to cashier_id
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);

  connection.query(sql, [body.order_id], function (err, row, fields) {
    if (err) {
      res.json({ error: "Error" });
    } else {
      console.log(body);
      res.json({ data: row[0].current_status });
    }
  });
});
// router.post("/offer_deal", validate_token, async (req, res) => {
//   let accessToken = req.header("accessToken");
//   let decoded_value = jwt_decode(accessToken);
//   const res_id = decoded_value.id;
// });

router.post("/cancel_order", validate_token, async (req, res) => {
  var query = "SELECT current_status FROM orders where order_id = (?) ";
  const body = req.body;

  connection.query(query, body.order_id, function (err, row, fields) {
    if (err) {
      res.json({ error: "Error" });
    } else {
      console.log("B");
      if (
        row[0].current_status == "Enroute" ||
        row[0].current_status == "Delivered"
      ) {
        res.json({ data: "Cannot cancel order" });
      } else {
        var sql = "DELETE FROM orders where order_id = (?) ";
        //change manager_id to cashier_id
        let accessToken = req.header("accessToken");
        let decoded_value = jwt_decode(accessToken);
        console.log(body.order_id);
        connection.query(sql, [body.order_id], function (err, row, fields) {
          if (err) {
            res.json({ error: "Error" });
          } else {
            res.json({ data: "Order cancelled" });
          }
        });
      }
    }
  });
});

router.post("/OfferDeal", async (req, res) => {
  const body = req.body;

  var sql = "INSERT INTO items (item_name,price) VALUES (?,?)";
  connection.query(
    sql,
    [body.deal_name, body.deal_price],
    function (err, row, fields) {
      if (err) {
        res.json({ error: err });
        console.log(err);
        console.log("Error1");
      } else {
        connection.query(
          "SELECT MAX(item_id) as max_id from items",
          function (err, row, feilds) {
            let deal_count = 0;
            deal_count = row[0].max_id;
            let accessToken = req.header("accessToken");
            let decoded_value = jwt_decode(accessToken);
            var sql_2 = "INSERT INTO menu_items VALUES (?,?,?,?,?,?,?)";

            connection.query(
              sql_2,
              [
                deal_count,
                decoded_value.id,
                body.deal_name,
                body.cat,
                body.deal_price,
                1,
                0,
              ],
              function (errs, rows, fieldss) {
                console.log(body);

                if (errs) {
                  res.json({ errors: errs });
                  console.log("error2");
                } else {
                  var sql_3 = "INSERT INTO deals VALUES(?,?,?,?)";
                  connection.query(
                    sql_3,
                    [deal_count, body.deal_name, body.deal_price, 1],
                    function (errss, rows, fieldsss) {
                      if (errss) {
                        console.log("error3");
                        res.json({ errorss: errss });
                      }
                      res.json({ completed: "Deal added" });
                    }
                  );
                }
              }
            );
          }
        );
      }
    }
  );
});

//Remove a deal
router.post("/DeleteDeal", async (req, res) => {
  const body = req.body;
  var sql = "DELETE FROM items WHERE item_id = (?)";
  connection.query(sql, body.id, function (err, row, fields) {
    if (err) {
      res.json({ error: err });
    }
  });

  //res.end("Deal Deleted");
});

//Edit a deal NEEDS EDIT
router.post("/EditDeal", async (req, res) => {
  const body = req.body;
  console.log(body)
  var sql = "SELECT item_id,item_name FROM items WHERE item_name = (?)";
  connection.query(sql, [body.changed], function (err, row, fields) {
    console.log(err)
    console.log(row)
    if (err) {
      console.log(errs)
      res.json({ error: err });
    }
    if (row.length == 0) {
      //console.log("hello")
      var sql_2 = "UPDATE items SET item_name = (?) WHERE item_id = (?)";
      connection.query(
        sql_2,
        [body.changed, body.item_id],
        function (errs, rows, fieldss) {
          if (errs) {
            console.log(errs)
            res.json({ error: errs });
          }
          var sql_3 =
            "UPDATE menu_items SET item_name = (?) WHERE item_id = (?)";
          connection.query(
            sql_3,
            [body.changed, body.item_id],
            function (errss, rowss, fieldsss) {
              if (errss) {
                console.log(errs)
                res.json({ error: errss });
              }
              var sql_4 = "UPDATE deals SET deal_name = (?) WHERE deal_id = (?)";
              connection.query(
                sql_4,
                [body.changed, body.item_id],
                function (errsss, rowsss, fieldssss) {
                  console.log(err)
                  if (errsss) {
                    console.log(errsss)
                    res.json({ error: errsss });
                  }
                  res.json({ confirmation: "Deal updated" });
                }
              );
            }
          );
        }
      );
    } else {
      console.log("here");
      var sql_5 =
        "SELECT item_name FROM menu_items WHERE restaurant_id = (?) AND item_name = (?)";
      connection.query(
        sql_5,
        [52, body.changed],
        function (errs, rows, fieldss) {
          if (errs) {
            res.json({ error: errs });
          }
          if (!rows.item_name) {
            res.json({ error: "Deal name already exists" });
          } else {
            var sql_6 = "UPDATE items SET item_name = (?) WHERE item_id = (?)";
            connection.query(
              sql_6,
              [body.changed, body.item_id],
              function (errss, rowss, fieldsss) {
                if (errss) {
                  res.json({ error: errss });
                }
                var sql_7 =
                  "UPDATE menu_items SET item_name = (?) WHERE item_id = (?)";
                connection.query(
                  sql_7,
                  [body.changed, body.item_id],
                  function (errsss, rowsss, fieldssss) {
                    if (errsss) {
                      res.json({ error: errsss });
                    }
                    var sql_8 =
                      "UPDATE deal SET item_name = (?) WHERE deal_id = (?)";
                    connection.query(
                      sql_8,
                      [body.changed, body.item_id],
                      function (errssss, rowssss, fieldsssss) {
                        if (errssss) {
                          res.json({ error: errssss });
                        }
                        res.json({ confirmation: "Deal Updated" });
                      }
                    );
                  }
                );
              }
            );
          }
        }
      );
    }
  });
});

module.exports = router;