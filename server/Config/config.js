var mysql = require("mysql2");

config = {
  host: "eu-cdbr-west-02.cleardb.net",
  user: "bcba601fa4ca71",
  password: "2ec81f29",
  database: "heroku_d2dc49946eb7367",
};
var connection = mysql.createPool(config); //added the line


module.exports = {
  connection: connection,
};
