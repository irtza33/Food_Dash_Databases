const {verify} = require('jsonwebtoken');

const validate_token = (req,res,next)=>{
    const accessToken = req.header("accessToken");

    if(!accessToken){
        return res.json({error:"User not logged in!"});
    }
    try{
        const valid_token = verify(accessToken,"Databases@Lums")
        
        if(valid_token){
            return next()
        }
    }catch(err){
        return res.json({error:err})
    }
}

module.exports={validate_token};