const db = require('../database');

function queryResponse (callback, err, status_ok) {
    if(err){
        callback(err,null);
        return;
    }
    callback(null,status_ok);
}


exports.createUser = (user,callback)=>{
    db.query(`INSERT INTO users(lastname, firstname, dateofbirth, email, hash, phonenumber, pseudo, city) VALUES ("${user.last_name}", "${user.first_name}", "${user.birthday}", "${user.email}", "${user.password}", "${user.telephone}", "${user.username}", "${user.city}");`,
     (err, status_ok)=>{
            if(err){
                callback(err,null);
                return;
            }
            callback(null,status_ok);
    })
}

exports.userLogin = (username, callback) => {
    db.query(`SELECT id, hash FROM users WHERE pseudo="${username}";`, 
        (err, status_ok)=>{
            if(err){
                callback(err,null);
                return;
            }
            callback(null,status_ok);
            
        });
}

exports.getUserID = (username, callback) =>{
    db.query(`SELECT id FROM users WHERE pseudo = "${username}";`,(err,response)=>{
        if(err) return callback(err,null);
        callback(null,response);
    }) 
}

exports.createTweet = (id,text,callback) =>{
    db.query(`INSERT INTO tweets(author_id, text) VALUES(${id},"${text}");`,(err,response)=>{
        if(err){
            callback(err,null);
        }
        callback(null,response);
    }) 
}