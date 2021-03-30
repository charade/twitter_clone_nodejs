const model = require("../model/model");
const cookie = require("cookie-parser");
const jwt = require ("jsonwebtoken");
const bcrypt = require("bcrypt");



exports.newUser = async(req,res)=>{

    
    
    
    const{last_name, first_name, birthday, email, password, telephone, username, city} = req.body;

    
    const MAX_AGE = new Date( Date.now() + 180000);////duree de vie de de 3min;
    try{
        ///hashage renouveller chaque fois pour le même mot de pass
        const hash = await bcrypt.hash(password,10);
        ////on change la valuer du mot de pass par le hash
        req.body.password = await hash;

        console.log(req.body);
        ////payload token
        const user = {
            user_lastname : last_name,
            user_firstname : first_name,
            user_name : username,
        }
        /////crération du token
        const SECRET_KEY = "azerty"
        const token = jwt.sign(user, SECRET_KEY);
        ////stockage du token
        const cookie = res.cookie("auth", token, {maxAge: MAX_AGE});
        // requête ajout de l'utilisateur dans la database
        model.createUser(req.body,(err,response)=>{
            if(err){
                res.send(err.message);
            }
            res.redirect('/profile');
        })
      }
    catch(err){
        console.log(err.message);
    }

   
   
   
}