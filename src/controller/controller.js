const model = require("../model/model");
const cookie = require("cookie-parser");
const jwt = require ("jsonwebtoken");
const bcrypt = require("bcrypt");
const e = require("express");
const { render } = require("ejs");
const { request } = require("express");

//log in
exports.newUser = async(req,res)=>{

    const{last_name, first_name, birthday, email, password, telephone, username, city} = req.body;

    try{
        const hash = await bcrypt.hash(password,10);
        //on change la valuer du mot de pass par le hash
        req.body.password = await hash;
        //payload token
        const user = {
            user_lastname : last_name,
            user_firstname : first_name,
            user_name : username
        }
        ///crération du token
        const SECRET_KEY = "azerty"
        const token = jwt.sign(user, SECRET_KEY);
        //stockage du token
        const cookie = res.cookie('authentication', token, {expires: new Date(Date.now()/1000 + 3600 )}) ;
        // requête ajout de l'utilisateur dans la database
        const img = req.files.picture;
        const img_base64_data = img.data.toString('base64');
        // check if username already exists:
        model.userLogin(username,async (err,IsUserExiste)=>{
            if(err){
                res.send(err);
                return;
            }
            if(IsUserExiste.length > 0){
                await req.flash('userExist', "username already exists");
                res.redirect('/signup');
            }
            else{
                model.createUser(req.body, img_base64_data , (err,response)=>{
                    if(err){
                        res.send(err.message);
                    }
                    res.redirect('/');
                  })
            }
          })
    }
    catch(err){
        console.log(err.message);
    }
}
///checkpoint à la login page
exports.login = (req, res, next) => {
    const {username, password} = req.body;
    // reponse de la requête
    model.userLogin (username, async (error, response)=>{
        
        if(error) {
            res.send(error.message);
        } 
        if(response.length ===0) {
            await req.flash("warning", "This user doesn't exist!");
            res.redirect("/");
        }  else {
            const checkPassword = await bcrypt.compare(password, response[0].hash);
            if(checkPassword) {
                next();
                return;
            } 
            
            await req.flash("warning", "Invalid Password")
            res.redirect("/");
            } 
    })
}
//ajout de tweet par l'utilisateur connecté
exports.addTweet = async (req, res) =>{
    const cookieValue   = req.cookies.authentication;//coresponding to token saved on login or signup
    // const base64_payload = cookieValue.split('.')[1];
    // const loading_payload = Buffer(base64_payload,'base64');
    // const decoded =  loading_payload.toString('ascii');
    // const USER_ID = JSON.parse(decoded).USER_ID;
    const user_id = await jwt.verify(cookieValue, "azerty").USER_ID;
    const tweet_message = req.body.message;
    model.createTweet(user_id, tweet_message, (err,response)=>{
        if(err){
            res.send(err.message);
        }
        res.redirect('/home');
    })
}

// middleware to authenticate user when browsing
exports.authentication= (req,res,next)=>{
    //cookie exp date 
    const EXPIRATION_DATE = new Date(Date.now() + 60 * 60 * 1000);
    const{username} = req.body;

    model.userLogin(username,(err,ID)=>{

        if(err){
            res.send(err.message);
        } 
        const user = {
            username : username,
            USER_ID : ID[0].id,
            expiration: EXPIRATION_DATE,
            city: ID[0].city,
        }
        console.log(user);
        const SECRET_KEY = "azerty"
        const token = jwt.sign(user, SECRET_KEY);
        //stockage du token
        res.cookie("authentication", token, {expires: EXPIRATION_DATE});
        res.redirect("/home")
    })
}

//log out
exports.logout = (req,res, next)=>{
    res.clearCookie('authentication',{path:'/'},{domain:"localhost"});
    next();
}

///////////////////last 20 tweets ////////////////////////////////////////////////////////
exports.displayTweets = (req, res) =>{
    model.tweetDisplay((err, response) => {
        if(err){
            console.log("erro404");
        }
        res.render('home.ejs',{response}); 
    })
}

//posting every connected user tweets
exports.allUserTweets = async (req, res , next) =>{
    const token = req.cookies.authentication; //coresponding to token saved on login or signup
    
    try{
        const SECRET_KEY = "azerty"
        const isAuthentic = await jwt.verify(token, SECRET_KEY) ;
        const userId = isAuthentic.USER_ID;
        //reponse de la requete....
        model.userTweets(userId, (err,response) => {
            if(err){
                console.log("quelques chose");
                return;
            }
           if(response.length > 0){
                console.log(typeof response[0].avatar)
               res.render("profile.ejs",{response} );
           } 
           else 
               next(); 
        })
    }
    catch (error) {
        res.send("veuilez vous connecter");
    }
}

//delete connected user tweets
exports.deleteUserTweets =  (req, res) =>{
    const id = req.params.id;

    model.deleteTweet( id, (err, resp)=>{
        if(err){
            res.send(err.message);
        }
        res.redirect("/username");
    })
}

///si on supprime tous les tweets de l'utilisteur on veut qu'il puisse quand même voir la page de son profil
exports.noTweetsView = async (req, res) => {
    const token = req.cookies.authentication; //coresponding to token saved on login or signup
    try{
        const SECRET_KEY = "azerty"
        const isAuthentic = await jwt.verify(token, SECRET_KEY) ;
        res.render("profileNoTweetView.ejs", {isAuthentic} )
        
        }
    catch (error){
        res.send("nous rencontrons quelques difficultés")
    }
}

exports.editTweet  = async(req,res)=>{

    const token  = req.cookies.authentication;
    const userId = await jwt.verify(token,"azerty").USER_ID;
    const id = req.params.id;
    console.log('user_id : ' + userId, 'tweet_id : ' + id);
    
    const {new_text_content} = req.body;
    console.log(id)
    model.editTweet(id,new_text_content,(err,response)=>{
        if(err){
            res.send(err.message);
        }
        res.redirect('/username');
    })
}
