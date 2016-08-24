'use strict';

var LocalStrategy = require('passport-local').Strategy;

module.exports.passport = function(User,passport){
    passport.use(new LocalStrategy(function(username, password, done){
        User.findOne({username:username,password:password},'username',function(err, user){
            if(err) {console.log('err............');return done(err); }
            if(!user) {return done(null, {});}
            return done(null,user);
        });
    }));
    passport.serializeUser(function(user, done){
        done(null,user);
    });
    passport.deserializeUser(function(user, done){
        User.findById(user._id, function(err, user){
            done(err,user);
        });
    });
};