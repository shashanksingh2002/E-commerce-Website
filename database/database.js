const { MongoClient } = require('mongodb');
const { hashPassword, cmpHashedPassword } = require('../src/bcrypt');
const { taxCalculationProducts, taxCalculationServices } = require('../src/taxcalculation');
const { generateUniqueId } = require('../src/generateid');

let db = null;
const dbName = 'plotline';
const uri = process.env.MONGO_URL;


const isEmailInDb = (Email) => {
    return db.collection('users')
    .findOne({email:Email})
    .then(found => found)
    .catch(err => {
        console.error(err);
        throw err;
    })
};

module.exports = {
    connectToDb: (cb) => {
        return MongoClient.connect(uri)
                .then(client => {
                    db = client.db(dbName);
                    cb();
                })
                .catch(err => cb(err));

    },
    insertUserData:async(body) => {
        //check if user is already present in database
        const checkEmailInDb = await isEmailInDb(body.email);
        if(checkEmailInDb){
            return checkEmailInDb;
        }
        //if user not present encrypt the password and add the user
        body.password = await hashPassword(body.password);
        return db.collection('users')
        .insertOne(body)
        .then(data => {
            return {
                "dbAck": data,
            };
        })
        .catch(err => {
            console.error(err);
            throw err;
        })
    },
    isEmailInDb,
    loginUser: (body) => {
        let user = [];
        return db.collection('users')
        .find({email:body.email})
        .forEach(d => user.push(d))
        .then(async () => {
            const cmpPassword = await cmpHashedPassword(body.password,user[0].password);
            if(cmpPassword){
                return db.collection('users')
                .updateOne({email:body.email},{$set:{isLoggedIn:true}})
                .then(data => {
                    return data;
                })
                .catch(err => err);
            }
            else{
                return false;
            }
        })
    },
    getProducts: (res) => {
        let data = [];
        return db.collection('products')
                .find({})
                .forEach(d => data.push(d))
                .then(() => res.json(data))
                .catch(err => console.write(err)) 
    },
    getServices: (res) => {
        let data = [];
        return db.collection('services')
                .find({})
                .forEach(d => data.push(d))
                .then(() => res.json(data))
                .catch(err => console.write(err)) 
    },
    addProducts: async (req,res) => {
        const data = {
            "productId": generateUniqueId("PROD"),
            "productName":req.body.productName,
            "productCost":req.body.productCost,
            "productCostAfterTax": taxCalculationProducts(req.body.productCost)
        }
        return db.collection('products')
               .insertOne(data)
               .then(ack => res.json(ack))
               .catch(err => console.error(err))
    },
    addServices: (req,res) => {
        const data = {
            "serviceId": generateUniqueId("SERV"),
            "serviceName":req.body.serviceName,
            "serviceCost":req.body.serviceCost,
            "serviceCostAfterTax": taxCalculationServices(req.body.serviceCost)
        }
        return db.collection('services')
               .insertOne(data)
               .then(ack => res.json(ack))
               .catch(err => console.error(err))
    },
    addToCart: async (req,res) => {
        const isAlreadyInCart = await checkIfAlreadyInCart(req.body.id);
        if(isAlreadyInCart){
            const query = {
                email: req.body.email,
                cart: { $elemMatch: { productId: req.body.id } }
            };
            return db.collection('users')
                    .findOne(query)
                    .then(async (found) => {
                        
                    })
                    .catch(err => console.error(err))
        }
        else{

        }
    }
}