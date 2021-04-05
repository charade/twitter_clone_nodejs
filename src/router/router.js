const  express = require('express');
const { Server } = require('http');
const { dirname } = require('path');
const router = express.Router();
const path = require("path");

const controller = require ('../controller/controller');

//vérifie que l'utilisateur est bien logué
function admin(req,res,next){
    if(req.cookies.authentication){
        next();
    }
    else{
        res.redirect('/');
    }
}
//user can create  tweet
router.post('/tweet',admin, controller.addTweet);

///login page est à la racine
router.get('/',controller.logout, async (req,res)=>{
    const error_msg = await req.consumeFlash("warning")
   res.render('login.ejs', {error_msg});
})

///page signup
router.get('/signup',async(req,res)=>{
    const err = await req.consumeFlash('userExist')
    res.render('signup.ejs',{err});
})

// signup + authentification
router.post('/register', controller.newUser);
///espace personnel
router.get('/home',admin, controller.displayTweets);
//////////////////////
router.post('/edit_tweet/:id', controller.editTweet);
////////espace personnel avec tous les tweets de l'utilisateur///////////////
router.get('/username',admin, controller.allUserTweets, controller.noTweetsView);

///////////supprimer les tweets/////////////////
router.get('/delete/:id', controller.deleteUserTweets);

router.get('/explore',admin,(req,res)=>{
    res.render('explore.ejs');
})

//le logout supprime le cookie d'authentification
// router.get('/',  controller.logout, (req,res)=>{
//      res.redirect('/home');
//  })


// login + authentification
router.post('/login', controller.login, controller.authentication);

module.exports = router;






   
