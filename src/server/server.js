const express = require("express");
const app = express();
const ejs = require('ejs');
const router = require("../router/router");
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(router);
app.use(express.static('./src/images'));
app.use(express.static('./src/css'));
// app.use(express.static('./src/html'));

app.engine("ejs", ejs.renderFile);
app.set("views", "./src/views");

//inscription d'un utilisateur
app.get('/register');

app.listen(2000,()=>console.log('server on'));




