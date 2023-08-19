const { insertUserData } = require("../database/database")

module.exports = {
    userSignUp: async(req,res) => {
        const userBody = {
            "username":req.body.username,
            "email":req.body.email,
            "password":req.body.password,
            "cart":[],
            "jwt":[]
        }
        const data = await insertUserData(userBody);
        if(!data.dbAck){
            return res.json({"flag":false,'Message':'User with this email already present, Please go to Login'})
        }
        else{
            return res.json({"flag":true});
        }
    }
}