const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./connection');

module.exports = function(passport) {
    // Supply unique way for passport to serialize each user
    passport.serializeUser(function(user, done) {
        //console.log(user.id);
        /*const userDto = {
            id: user.id,
            username: user.username
        }*/
        done(null, user.id);
    });

    // Supply a way for passport to deserialize each user based on serialization
    passport.deserializeUser(function(user, done) {
        /*let info = {
            id: user.id
        }*/
        let sql = `SELECT * FROM users WHERE id=?`;
        db.query(sql, user, (err, result) => {
            if(err) {
                done(err, false);
            } else {
                const user = result[0];
                done(null, user);
            }
    
        });
    });

    // Supply strategy for confirming a users credentials
    passport.use(new LocalStrategy(
        function(username, password, done) {

            let info = {
                username,
            }
            let sql = `SELECT * FROM users WHERE ?`;
            db.query(sql, info, (err, result) => {
                if(err) {
                    return done(err);
                } else {
                    const user = result[0];

                    bcrypt.compare(password, user.password, (err, response) => {
                        if(err) return done(err);
                        if(response === true) {
                            return done(null, user);
                        }
                        return done(null, false);
                    });
                }
        
            });
        }
    ));
}