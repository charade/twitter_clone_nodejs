const  express = require('express');
const { dirname } = require('path');
const router = express.Router();
const path = require("path");

const controller = require ('../controller/controller');

router.get('/',(req,res)=>{
   res.sendFile(path.join( __dirname, '../html/login.html'));
})
///page login
router.get('/signup',(req,res)=>{
    res.sendFile(path.join( __dirname, '../html/signup.html'));
})
///espace personnel
router.get('/home', (req,res)=>{
    res.sendFile(path.join(__dirname, '../html/index.html'));
})
router.get('/username', (req,res)=>{
    res.sendFile(path.join(__dirname, '../html/profile.html'));
})

router.get('/logout', (req,res)=>{
    res.redirect('/home');
})

router.post('/signup', controller.newUser);
///page inscrption utilisateur
// router.post('/register',controller.function);
router.post('/login', controller.getUsername, controller.login);



module.exports = router;

   
