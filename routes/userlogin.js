const { isEmailInDb, loginUser } = require("../database/database");


module.exports = {
    userLogin: async(req,res) =>{
        const isEmailPresent = await isEmailInDb(req.body.email);
        if(!isEmailPresent){
            return res.json({emailFlag:true,passwordFlag:true,Message:"No such Email Exists please check your email"});
        }
        const ispasswordCorrect = await loginUser(req.body);
        if(!ispasswordCorrect){
            return res.json({emailFlag:false,passwordFlag:true,Message:"Please enter the correct password"});
        }
        return res.json({emailFlag:false,passwordFlag:false});
    }
};