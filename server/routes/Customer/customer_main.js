const { response } = require('express');
const express = require('express');
const mysql = require('mysql2')
const router = express.Router()
const config = require('../../Config/config')
const {validation_token, validate_token}=require('../../middleware/auth_middleware')
const connection=config.connection


router.get('/',validate_token,async (req,res)=>{

    res.send("Hey You are logged in!")
})

module.exports=router