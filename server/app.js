var express = require('express');
var cors = require("cors");
var mysql =require('mysql2')
const router = express.Router();
var counter=1

var app = express();
app.use("/",router)
app.use(express.json())
app.use(cors());


// Mysql Part
var connection = mysql.createConnection({
  host:'localhost',
  user:'haseeb',
  password:'1399Ahmed',
  database:'db'
})

connection.connect(err => {
  if(err){
      return err;
  }else{
    console.log("Connected!")
  }
})


app.post("/register",(request,response)=>{
    const body = request.body
    var sql_query="INSERT INTO accounts VALUES(?,?,?,?,?)"
    counter=counter+1
    connection.query(sql_query,[counter,body.username,body.password,body.password,1],function(err,row,feilds){
      if (err){
        console.log(err)
      }
    })
  response.end("Recieved and posted")
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

