require('dotenv').config();
const express = require('express');
const { connectToDb, getProducts, getServices, addProducts, addServices } = require('./database/database');
const { userSignUp } = require('./routes/signup');
const { userLogin } = require('./routes/userlogin');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());


connectToDb((err) => {
    if(!err){
        app.listen(port,() => {
            console.log('Connected to database and port at: ',port);
        })
    }
    else{
        console.error(err);
    }
});

app.post('/api/signup', (req,res) => {
    userSignUp(req,res);
});

app.post('/api/login', (req,res) => {
    userLogin(req,res);
});

app.post('/api/products', (req,res) => {
    getProducts(res);
});

app.post('/api/services', (req,res) => {
    getServices(res);
});

app.post('/api/admin/addproducts', (req,res) => {
    addProducts(req,res);
})

app.post('/api/admin/addservices', (req,res) => {
    addServices(req,res);
})

app.post('/api/addcart', (req,res) => {
    
});

