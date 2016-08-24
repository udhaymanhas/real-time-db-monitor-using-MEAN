'use strict';

exports.use = function(app, bodyParser, cookieParser, session, passport){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(session({
        key: 'some_key' ,
        secret: 'session_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 2419200000
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};
