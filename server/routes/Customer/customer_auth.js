const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const config = require("../../Config/config");
const connection = config.connection;
const bcrypt = require("bcrypt");

const { sign } = require("jsonwebtoken");

// 1--> Customer
// 2--> Restaurant
// 3--> Manager
// 4--> Cashier

//Register
router.post("/", async (request, response) => {
  var counter = 0;

  connection.query(
    "SELECT MAX(account_id) as max_id from accounts",
    function (err, row, feilds) {
      counter = row[0].max_id;
      if (counter == null) {
        counter = 0;
      }
    }
  );

  const body = request.body;
  var check_query = "SELECT * from accounts where user_name = ?";
  connection.query(check_query, [body.username], function (err, row, fields) {
    if (err) {
      response.json({ error: err });
    } else {
      if (row.length != 0) {
        response.json({ error: "Please enter a unique user name" });
      } else {
        console.log(body);
        user_type = body.userType;
        var sql_query = "INSERT INTO accounts VALUES(?,?,?,?,?)";
        counter = counter + 1;
        console.log(counter);
        bcrypt.hash(body.password, 10).then((hash) => {
          connection.query(
            sql_query,
            [counter, body.username, hash, hash, user_type],
            function (err, row, fields) {
              if (err) {
                response.json({ error: err });
              } else {
                //Customer
                if (user_type == 1) {
                  sql_query =
                    "INSERT INTO customer VALUES(?,?,?,?,?,?,?,?,?,?)";
                  connection.query(
                    sql_query,
                    [
                      counter,
                      body.username,
                      body.address,
                      body.area,
                      body.email,
                      body.number,
                      body.dob,
                      body.bank_number,
                      body.cvv,
                      body.expiry,
                    ],
                    function (err, row, fields) {
                      if (err) {
                        response.json({ error: err });
                      }
                    }
                  );
                }
                //Manager
                if (user_type == 3) {
                  console.log("Mgr");
                  sql_query = "INSERT INTO MANAGER VALUES(?,?,?,?,?)";
                  connection.query(
                    sql_query,
                    [
                      counter,
                      body.username,
                      body.address,
                      body.email,
                      body.number,
                    ],
                    function (err, row, fields) {
                      if (err) {
                        response.json({ error: err });
                      }
                    }
                  );
                }
                //Cashier
                if (user_type == 4) {
                  sql_query = "INSERT INTO cashier VALUES (?,?,?,?,?)";
                  connection.query(
                    sql_query,
                    [
                      counter,
                      body.username,
                      body.address,
                      body.email,
                      body.number,
                    ],
                    function (err, row, fields) {
                      if (err) {
                        response.json({ error: err });
                      }
                    }
                  );
                }
              }
            }
          );
        });
        response.json({ data: "User Created" });
      }
    }
  });
});

//Login Auth
router.post("/login", async (request, response) => {
  const body = request.body;
  console.log;

  var sql_query =
    "SELECT * FROM accounts WHERE user_name=(?) AND permissions=(?)";
  connection.query(
    sql_query,
    [body.username, body.userType],
    function (err, row, fields) {
      if (err) {
        response.json({ error: "No such account exists!" });
      } else if (!row.length) {
        response.json({ error: "NO such account exists!" });
      } else {
        console.log(body.userType);
        if (body.userType == 3) {
          connection.query(
            "SELECT verified FROM restaurant WHERE restaurant_id = (SELECT account_ID FROM accounts where user_name = ?)",
            [body.username],
            function (err, rows, fields) {
              if (err) {
                response.json({ error: "Error occured!" });
              } else {
                console.log(row);
                if(!row.length){
                  response.json({error: "No restaurant registered!"})
                }
                else if (rows[0].verified == 0) {
                  response.json({ error: "Restaurant not yet verified!" });
                } else {
                  bcrypt
                    .compare(body.password, row[0].current_password)
                    .then((match) => {
                      if (!match) {
                        response.json({
                          error: "Wrong username and password combination!",
                        });
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
              }
            }
          );
        }
        if (body.userType == 4) {
          connection.query(
            "SELECT verified FROM restaurant WHERE cashier_id = (SELECT cashier_id FROM cashier where cashier_name = ?)",
            [body.username],
            function (err, rows, fields) {
              if (err) {
                response.json({ error: "Error occured!" });
              } else {
                if (rows[0].verified == 0) {
                  response.json({ error: "Restaurant not yet verified!" });
                } else {
                  bcrypt
                    .compare(body.password, row[0].current_password)
                    .then((match) => {
                      if (!match) {
                        response.json({
                          error: "Wrong username and password combination!",
                        });
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
              }
            }
          );
        } else {
          bcrypt
            .compare(body.password, row[0].current_password)
            .then((match) => {
              if (!match) {
                response.json({
                  error: "Wrong username and password combination!",
                });
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
      }
    }
  );
});

// For Every page that has restricted access.
//Header file mey sirf token pass kerna hai.

module.exports = router;
