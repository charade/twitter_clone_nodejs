const model = require("../model/model");
const cookie = require("cookie-parser");
const jwt = require ("jsonwebtoken");
const bcrypt = require("bcrypt");
const e = require("express");
const { render } = require("ejs");



exports.newUser = async(req,res)=>{
    
    const{last_name, first_name, birthday, email, password, telephone, username, city} = req.body;

    
    
     ////duree de vie de de 3min;
    try{
        ///hashage renouveller chaque fois pour le même mot de pass
        const hash = await bcrypt.hash(password,10);
        //on change la valuer du mot de pass par le hash
        req.body.password = await hash;

        //payload token
        const user = {
            user_lastname : last_name,
            user_firstname : first_name,
            user_name : username,
        }
        ///crération du token
        const SECRET_KEY = "azerty"
        const token = jwt.sign(user, SECRET_KEY);
        //stockage du token
        const cookie = res.cookie('authentication', token, {expires: new Date(Date.now()/1000 + 3600 )}) ;
        // requête ajout de l'utilisateur dans la database
        model.createUser(req.body,(err,response)=>{
            if(err){
                res.send(err.message);
            }
            res.redirect('/home');
        })
      }
    catch(err){
        console.log(err.message);
    }
}

// Authentication

exports.login = (req, res) => {
    const {username, password} = req.body;
 
    // reponse de la requête
    model.userLogin (username, async (error, response)=>{
        
        if(error) {
            res.send(error.message);
        }
        if(response.length ===0) {
            res.send("User doesn't exist !")
        }  else {
            const checkPassword = await bcrypt.compare(password, response[0].hash);
            if(checkPassword) {
                res.redirect("/home");
                return;
            } 
            res.send("Invalid Password !");
            } 
    })
}

exports.addTweet = (req, res) =>{

    const cookieValue   = req.cookies.authentication;//coresponding to token saved on login or signup
    const base64_payload = cookieValue.split('.')[1];
    const loading_payload = Buffer(base64_payload,'base64');
    const decoded =  loading_payload.toString('ascii');
    const USER_ID = JSON.parse(decoded).USER_ID;

    const tweet_message = req.body.message;

    

    
    model.createTweet(USER_ID, tweet_message, (err,response)=>{
        if(err){
            res.send(err.message);
        }
        
        res.redirect('/home');
    })
}


//middleware to authenticate user when browsing
exports.authentication=(req,res,next)=>{
    
    next();
    //date d'expiration du cookie 

    const EXPIRATION_DATE = new Date(Date.now() + 60 * 60 * 1000);

    const{username} = req.body;

    model.getUserID(username,(err,ID)=>{
        if(err){
            res.send(err.message);
        } 
    

        const user = {
                USER_ID : ID[0].id,
                expiration: EXPIRATION_DATE
            }

        const SECRET_KEY = "azerty"
        const token = jwt.sign(user, SECRET_KEY);
        //stockage du token
        res.cookie("authentication", token, {expires: EXPIRATION_DATE});
        
    })
   
     ////duree de vie  de 3min;
        ///crération du token
}

exports.logout = (req,res, next)=>{
    // const token = req.cookies.authentication;
    // res.cookie('authentication',token,{expires : new Date(Date.now() - 84000)});
    res.clearCookie('authentication',{path:'/'},{domain:"localhost"});
    next();

}

///////////////////20 derniers tweets ////////////////////////////////////////////////////////
exports.displayTweets = (req, res) =>{
    model.tweetDisplay((err, response) => {
        if(err){
            console.log("erro404");
        }
        res.render('home.ejs',{response}); 
    })
}


 exports.allUserTweets = async (req, res) =>{
    
    const token = req.cookies.authentication; //coresponding to token saved on login or signup
    try{
        const SECRET_KEY = "azerty"
        const isAuthentic = await jwt.verify(token, SECRET_KEY) ;
        const userId = isAuthentic.USER_ID;
        console.log(isAuthentic);

        //////reponse de la requete..../////////////////
        model.userTweets(userId, (err,response) => {
            if(err){
                console.log("quelques chose");
            }
            res.render("profile.ejs",{response} );
            console.log(response);
        })
    }
    catch (error) {
        res.send("veuilez vous connecter");
    }
}



// exports.regenerateCookie = (req, res, next) =>{
  

//     const cookieValue   = req.cookies.authentication;//coresponding to token saved on login or signup
//     const base64_payload = cookieValue.split('.')[1];
//     const loading_payload = Buffer(base64_payload,'base64');
//     const decoded =  loading_payload.toString('ascii');
//     const expirationDateCookie = JSON.parse(decoded).expiration;

//     if (Date.now() - expirationDateCookie < 30000){

//         const token = cookieValue;
//         res.cookie("authentication", token, {expires:expirationDateCookie})
//     }
//     next();
// }

