const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./connection');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        //console.log(user.id);
        const userDto = {
            id: user.id,
            username: user.username
        }
        done(null, userDto);
    });

    passport.deserializeUser(function(user, done) {
        let info = {
            id: user.id
        }
        let sql = `SELECT * FROM users WHERE ?`;
        db.query(sql, info, (err, result) => {
            if(err) {
                done(err, false);
            } else {
                const user = result[0];
                done(null, user);
            }
    
        });
    });

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