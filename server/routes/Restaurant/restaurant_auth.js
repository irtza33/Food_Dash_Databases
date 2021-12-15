const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const config = require("../../Config/config");
const connection = config.connection;
const bcrypt = require("bcrypt");

const { sign } = require("jsonwebtoken");

//Register
router.post("/", async (request, response) => {
  var counter = 0;

  const body = request.body;
  connection.query(
    "SELECT account_id from accounts where user_name = (?)",
    [body.manager_name],
    function (err, row, fields) {
      if (row.length == 0) {
        response.json({ error: "No matching manager!" });
      } else {
        counter = row[0].account_id;
        connection.query(
          "SELECT account_id from accounts where user_name = (?)",
          [body.cashier_name],
          function (err, row, fields) {
            if (row.length == 0) {
              response.json({ error: "No matching cashier!" });
            } else {
              console.log(body);
              console.log(counter);
              var cashier = row[0].account_id;
              console.log(cashier);
              bcrypt.hash(body.password, 10).then((hash) => {
                sql_query =
                  "INSERT INTO restaurant VALUES(?,?,?,?,?,?,?,?,1,0)";
                connection.query(
                  sql_query,
                  [
                    counter,
                    body.username,
                    body.address,
                    body.area,
                    body.cuisine,
                    body.number,
                    counter,
                    cashier,
                  ],
                  function (err, row, fields) {
                    if (err) {
                      response.json({ error: "Query didnt run" });
                    } else {
                      response.json({ data: "Restaurant Created" });
                    }
                  }
                );
              });
            }
          }
        );
      }
    }
  );

  //Need Manager and Cashier Username as well
});

//Login Auth
router.post("/login", async (request, response) => {
  const body = request.body;
  user_type = body.userType;
  if (user_type != 2) {
    response.json({ error: "This is restaurant Login! Try other login" });
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

module.exports = router;
