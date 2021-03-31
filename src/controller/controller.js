const model = require("../model/model");
const cookie = require("cookie-parser");
const jwt = require ("jsonwebtoken");
const bcrypt = require("bcrypt");



exports.newUser = async(req,res)=>{
    
    const{last_name, first_name, birthday, email, password, telephone, username, city} = req.body;

    
    const EXPIRATION_DATE = new DATE(Date.now() + 1000);
    EXPIRATION_DATE   = EXPIRATION_DATE.toUTCString();
     ////duree de vie de de 3min;
    try{
        ///hashage renouveller chaque fois pour le même mot de pass
        const hash = await bcrypt.hash(password,10);
        //on change la valuer du mot de pass par le hash
        req.body.password = await hash;

        console.log(req.body);
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
        const cookie = res.cookie(username, token, {expires: EXPIRATION_DATE});
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
        console.log(response[0].hash)
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

    const cookieValule   = req.cookies.authentication;//coresponding to token saved on login or signup
    const base64_payload = cookieValule.split('.')[1];
    const loading_payload = Buffer(base64_payload,'base64');
    const decoded =  loading_payload.toString('ascii');
    const USER_ID = JSON.parse(decoded).USER_ID;

    const tweet_message = req.body.message;

    
    model.createTweet(USER_ID, tweet_message, (err,response)=>{
        if(err){
            res.send(err.message);
        }
        console.log('tweet it');
        res.redirect('/home');
    })
}


//middleware to authenticate user when browsing
exports.authentication=(req,res,next)=>{
    req.authenticate = "true";
    next();
    //date d'expiration du cookie 

    const EXPIRATION_DATE = new Date(Date.now() + 84000);

    const{username} = req.body;

    model.getUserID(username,(err,ID)=>{
        if(err){
            res.send(err.message);
        } 
        console.log(ID);

        const user = {
                USER_ID : ID[0].id
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