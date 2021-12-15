const { response } = require("express");
const express = require("express");
const mysql = require("mysql2");
const jwt_decode = require("jwt-decode");
const router = express.Router();
const config = require("../../Config/config");
const { validate_token } = require("../../middleware/auth_middleware");
const bcrypt = require("bcrypt");
const { decode } = require("jsonwebtoken");
const connection = config.connection;

//Forgot Password
router.post("/Fpass", async (req, res) => {
  const body = req.body;
  var query =
    "SELECT current_password, user_name FROM accounts WHERE user_name = (?)";
  connection.query(query, [body.username], function (err, row, fieds) {
    if (err) {
      res.json({ error: err });
      console.log(err);
    } else {
      const currpwd = row[0].current_password;
      var sql =
        "UPDATE accounts SET current_password = ?, previous_pwd = ? WHERE user_name = (?)";
      bcrypt.hash(body.password, 10).then((hash) => {
        connection.query(
          sql,
          [hash, currpwd, body.username],
          function (err, row, fields) {
            if (err) {
              console.log("Err");
              res.json({ error: err });
            } else {
              res.json({ data: "Passsword changed successfully!" });
            }
          }
        );
      });
    }
  });
});

//Change Password
router.post("/Cpass", validate_token, async (req, res) => {
  const body = req.body;
  let accessToken = req.header("accessToken");
  let decoded_value = jwt_decode(accessToken);
  console.log(decoded_value);
  if (body.username != decoded_value.username) {
    res.json({ data: "Incorrect username" });
  } else {
    var query = "SELECT current_password FROM accounts where user_name = (?)";
    connection.query(
      query,
      [decoded_value.username],
      function (err, row, fields) {
        if (err) {
          res.json({ error: err });
        } else {
          currpwd = row[0].current_password;
          console.log(currpwd);
          var sql =
            "UPDATE accounts SET current_password = ?, previous_pwd = ? WHERE user_name = ?";
          bcrypt.hash(body.password, 10).then((hash) => {
            connection.query(
              sql,
              [hash, currpwd, decoded_value.username],
              function (err, rows, fields) {
                if (err) {
                  console.log("Err");
                  res.json({ error: err });
                } else {
                  res.json({ data: "Passsword changed successfully!" });
                }
              }
            );
          });
        }
      }
    );
    //     var sql =
    //       "UPDATE accounts SET current_password = (?) WHERE user_name = (?)";
    //     bcrypt.hash(body.password, 10).then((hash) => {
    //       connection.query(
    //         sql,
    //         [hash, decoded_value.username],
    //         function (err, row, fields) {
    //           if (err) {
    //             console.log("A");
    //             res.json({ error: err });
    //           } else {
    //             res.json({ data: "Passsword changed successfully!" });
    //           }
    //         }
    //       );
    //     });
  }
});

module.exports = router;
