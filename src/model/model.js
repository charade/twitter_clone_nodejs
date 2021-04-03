const db = require('../database');

function queryResponse (callback, err, status_ok) {
    if(err){
        callback(err,null);
        return;
    }
    callback(null,status_ok);
}


exports.createUser = (user, picture, callback)=>{
    db.query(`INSERT INTO users(lastname, firstname, dateofbirth, email, hash, phonenumber, pseudo, city, avatar) VALUES ("${user.last_name}", "${user.first_name}", "${user.birthday}", "${user.email}", "${user.password}", "${user.telephone}", "${user.username}", "${user.city}", "${picture});`,
     (err, status_ok)=>{
            if(err){
                callback(err,null);
                return;
            }
            callback(null,status_ok);
    })
}

exports.userLogin = (username, callback) => {
    db.query(`SELECT id, hash, city, avatar FROM users WHERE pseudo="${username}";`, 
        (err, status_ok)=>{
            if(err){
                callback(err,null);
                return;
            }
            callback(null,status_ok);
            
        });
}

// exports.getUserID = (username, callback) =>{
//     db.query(`SELECT id, city FROM users WHERE pseudo = "${username}";`,(err,response)=>{
//         if(err) return callback(err,null);
//         callback(null,response);
//     }) 
// }

exports.createTweet = (id,text,callback) =>{
    db.query(`INSERT INTO tweets(author_id, text) VALUES(${id},"${text}");`,(err,response)=>{
        if(err){
            callback(err,null);
        }
        callback(null,response);
    }) 
}


exports.tweetDisplay = (callback) =>{
    db.query(`select users.pseudo,tweets.text,tweets.creation_date from tweets inner join users on tweets.author_id = users.id   ORDER BY tweets.id DESC LIMIT 20;`
     , (err,response) =>{
        if (err) {
            callback(err, null);
            return;
        }
        callback(null,response);
    })

}

exports.userTweets = (user_id, callback) =>{
    db.query(`SELECT users.pseudo, users.city, tweets.text, tweets.creation_date, tweets.id FROM tweets INNER JOIN users ON tweets.author_id = users.id WHERE author_id = ${user_id};`
     , (err,response) =>{
        if (err) {
            callback(err, null);
            return;
        }
        callback(null,response);
    })
}
///////////////////effacer le tweet d'un utilisateur//////////////////////////
exports.deleteTweet = (tweet_id, callback) =>{
    db.query(`DELETE FROM tweets WHERE id =  ${tweet_id};`
    ,(err,response) =>{
        if (err) {
            callback(err, null);
            return;
        }
        callback(null,response);
    })
}

///editing tweet query
exports.editTweet = (id,new_text,callback)=>{
    db.query(`UPDATE tweets SET text = "${new_text}" where id = ${id};`,(err,resp)=>{

        if(err){
            callback(err,null);
            return;
        }
        callback(null,err)
    })
}
