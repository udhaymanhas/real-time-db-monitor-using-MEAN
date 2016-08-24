'use strict';

exports.routes = function(app, express, passport){

    app.use('/',express.static(process.cwd() +'/public'));
    app.use('/jquery', express.static(process.cwd() +'/node_modules/jquery/dist'));
    app.use('/angular', express.static(process.cwd() +'/node_modules/angular'));
    app.use('/angular-route', express.static(process.cwd() +'/node_modules/angular-route'));
    app.use('/angular-material', express.static(process.cwd() +'/node_modules/angular-material'));
    app.use('/bootstrap', express.static(process.cwd() +'/node_modules/bootstrap/dist'));

    //all the server routes where you can fetch and post the data from.
    app.post('/loginUser',
        passport.authenticate('local'),
        function(req, res) {
            res.json({ user: req.user });
        });

    app.get('/logout',
        function(req, res){
            req.logout();
            res.redirect('/');
        });

    //gets all existing collections on your local replica set from where clients can subscribe to fetched collections and their fields.
    app.get('/settings',function(req,res){
        require('../controllers/settings.controller').settings(req, res);
    });

    //gets the subscription as per the authenticated user id, if doesn't exist it will create an empty subscription on first login, then user can subscribe later
    app.post('/settings/subscription',function(req,res){
        require('../controllers/subscription.controller').subscription(req, res);
    });

    //when user add or edits subscriptions
    app.post('/updateUserDaemon', function(req, res){
        require('../controllers/daemonUpdateController.js').update(req,res);
    });
};