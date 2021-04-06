const model = require("../model/model");
const jwt = require ("jsonwebtoken");
const bcrypt = require("bcrypt");
const e = require("express");
const { render } = require("ejs");
const { request } = require("express");

const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('../local_storage');
const path = require('path');

/////inscription
exports.newUser = async(req,res)=>{

    const{last_name, first_name, birthday, email, password, telephone, username, city} = req.body;

    try{
        ///hashage renouveller chaque fois pour le même mot de pass
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
       
        const img = req.file ? req.files.picture : "";

        const img_base64_data = img.data.toString('base64');

        ////test si un utilisateur ale même pseudo///////////:
        model.userLogin(username,async (err,IsUserExiste)=>{
            if(err){
                console.log('line 46')
                await req.flash('userExist', 'it seems an error occured');
                res.redirect('/signup')
                return;
            }
            if(IsUserExiste.length > 0){
                console.log('line 52')
                await req.flash('userExist', "username already exists");
                // res.redirect('/signup');
                return;
            }
            else{
                model.createUser(req.body, img_base64_data , async(err,response)=>{
                    if(err){
                        console.log('line 59')
                        await req.flash('userExist', 'it seems an error occured');
                    }
                    console.log('line 62');
                    res.redirect('/');
                  })
            }
           
          })
    }
    catch(err){
        res.redirect('/signup');
    }
}
       
///checkpoint à la login page
exports.login = (req, res, next) => {
    const {username, password} = req.body;
    
    // reponse de la requête
    model.userLogin(username, async (error, response)=>{
        
        if(error) {
            await req.flash('warning', 'it seems an error occured');
            res.redirect('/');
            return;
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
// middleware to authenticate user when browsing
exports.authentication= async(req,res,next)=>{
    
    //date d'expiration du cookie 
    const EXPIRATION_DATE = new Date(Date.now() + 60 * 60 * 1000);
    const{username} = req.body;

    model.userLogin(username,async(err,ID)=>{

        if(err){
            await req.flash('warning', 'athentication error');
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
        //Sauvegarde l'image dans un local storage
        if(ID[0].avatar){
            localStorage.setItem('avatar', ID[0].avatar);
        }
        else{
            
            localStorage.setItem('avatar', "");
        }
        
        res.redirect("/home");
    })
}
////affiche les 20 derniers tweets sur la home page
exports.displayTweets = (req, res) =>{
    model.tweetDisplay((err, response) => {               
        if(err){
            res.redirect('/');
            return;
        }
        res.render('home.ejs',{response}); 
    })
}

//ajout de tweet par l'utilisateur connecté depuis la home page
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
            console.log(err);
        }
        res.redirect('/home');
    })
}


///////////////////20 derniers tweets ////////////////////////////////////////////////////////

//affiche tous les tweets de l'utilisateur connecté sur la page de son profil
exports.allUserTweets = async (req, res , next) =>{
    const token = req.cookies.authentication; //coresponding to token saved on login or signup
    
    try{
        const SECRET_KEY = "azerty"
        const token_payload = await jwt.verify(token, SECRET_KEY) ;
        const userId = token_payload.USER_ID;
        //reponse de la requete....
        model.userTweets(userId, (err,response) => {
            if(err){
                res.redirect('/home');
                return;
            }
          ///////////////////////////////
            const stored_avatar = localStorage.getItem('avatar');
            const avatar_to_render  =  stored_avatar != ""? `data:image/jpg;base64,${stored_avatar}` : "default_avatar.png";//////
            res.render("profile.ejs",{response, token_payload, avatar_to_render} );
        })
    }
    catch (error) {
        res.redirect('/');
        await req.flash('warning', 'veuillez vous reconnecter');
    }
}

//supprime le tweet d'un utilisateur connecté
exports.deleteUserTweets =  (req, res) =>{
    const id = req.params.id;

    model.deleteTweet( id, (err, resp)=>{
        if(err){
            console.log("can't delete");
        }
        res.redirect("/username");
    })
}

///si on supprime tous les tweets de l'utilisteur on veut qu'il puisse quand même voir la page de son profil
// exports.noTweetsView = async (req, res) => {
//     const token = req.cookies.authentication; //coresponding to token saved on login or signup
//     try{
//         const SECRET_KEY = "azerty"
//         const isAuthentic = await jwt.verify(token, SECRET_KEY) ;
//         res.render("profileNoTweetView.ejs", {isAuthentic} )
        
//         }
//     catch (error){
//         res.send("nous rencontrons quelques difficultés")
//     }
// }

////permet de modifier le tweet d'un user connecté
exports.editTweet  = async(req,res)=>{

    const token  = req.cookies.authentication;
    const userId = await jwt.verify(token,"azerty").USER_ID;
    const id = req.params.id;
    console.log('user_id : ' + userId, 'tweet_id : ' + id);
    
    const {new_text_content} = req.body;
    console.log(id)
    model.editTweet(id,new_text_content,(err,response)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/username');
    })
}

//deconnexion
exports.logout = (req,res, next)=>{
    res.clearCookie('authentication',{path:'/'},{domain:"localhost"});
    next();
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

