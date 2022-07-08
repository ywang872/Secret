//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");//npm mongoose-encryption
const md5 = require("md5");//hash function encrypt

const app = express();
console.log(process.env.SECRET);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");
// mongoose.connect("mongodb+srv://admin:0vvd6zD11jVSnWkg@cluster0.ighcb.mongodb.net/wikiDB");

//new mongoose.Schema is from mongoose-encryption
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//this part is from from mongoose-encryption level 2 encryption, but what this will do is it will encrypt our entire database.we want encrypt only certain fields
// const secret = "Thisisourlittlesecret";
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
//process.env.SECRET is from "dotenv" level 3 encryption
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
})
app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        // password: req.body.password
        password: md5(req.body.password)//hash encrept
    });
    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets")
        }
    })
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    // const password = req.body.password;
    const password = md5(req.body.password);//hash encrept

    //foundUser is an object
    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser.password === password) {
                res.render("secrets");
            }
        }
    })
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
