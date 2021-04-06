const express      = require("express");
const app          = express();
const ejs          = require('ejs');
const router       = require("../router/router");
const bodyParser   = require('body-parser');
const cookieParser = require("cookie-parser");
const session      = require("express-session");
const {flash}      = require("express-flash-message");
const fileUpload   = require('express-fileupload');

app.use(session({
    secret: "keyboard cat",
    resave: false,
    cookie: {secure: false},
    saveUninitialized: true
}));

app.use(flash({ sessionKeyName: "flashMessage"}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(router);
app.use(express.static('./src/images'));
app.use(express.static('./src/css'));
app.use(express.static('./src/js'));
// app.use(express.static('./src/local_storage'));

app.engine("ejs", ejs.renderFile);
app.set("views", "./src/views");

app.listen(4000,()=>console.log('server on')); 







