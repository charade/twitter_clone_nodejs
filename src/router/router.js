const  express = require('express');
const { Server } = require('http');
const { dirname } = require('path');
const router = express.Router();
const path = require("path");

const controller = require ('../controller/controller');

//user can create  tweet
router.post('/tweet', controller.addTweet);

///login page est à la racine
router.get('/',controller.logout,(req,res)=>{
   res.sendFile(path.join( __dirname, '../html/login.html'));
})
///page signup
router.get('/signup',(req,res)=>{
    res.sendFile(path.join( __dirname, '../html/signup.html'));
})
///espace personnel
router.get('/home', controller.displayTweets);
    
////////espace personnel avec tous les tweets de l'utilisateur///////////////
router.get('/username', controller.allUserTweets, controller.noTweetsView);

///////////supprimer les tweets/////////////////
router.get('/delete/:id', controller.deleteUserTweets);



//le logout supprime le cookie d'authentification
router.get('/',  controller.logout, (req,res)=>{
     res.redirect('/home');
 })


// signup + authentification
router.post('/signup', controller.newUser);

// login + authentification
router.post('/login', controller.authentication, controller.login);

module.exports = router;






   
