const express = require("express");
const app = express();
const ejs = require('ejs');
const router = require("../router/router");
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const {flash} = require("express-flash-message");
const fileUpload = require('express-fileupload');


app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.use(flash({ sessionKeyName: "flashMessage"}));
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(fileUpload())

app.use(router);
app.use(express.static('./src/images'));
app.use(express.static('./src/css'));
app.use(express.static('./src/js'));

app.engine("ejs", ejs.renderFile);
app.set("views", "./src/views");

//inscription d'un utilisateur


let port  = process.env.port || 2000 ;

app.listen(port,()=>console.log('server on')); 







