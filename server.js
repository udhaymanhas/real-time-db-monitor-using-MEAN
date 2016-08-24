'use strict';

var clients =[]; //stores clients details and its subscriptions

require('dotenv').load(); // load environment variable from .env

var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = require('./server/models/userModel'); //user model for user info

mongoose.connect('mongodb://udhay:socketio@ds139685.mlab.com:39685/db-sc'); //user db is kept separate, it hold user info and their respective subscription details. Hosted on mlab.com

require('./server/passport').passport(User,passport); // login authentication using passport, implementing a LocalStrategy

require('./server/use').use(app,bodyParser,cookieParser,session,passport); //setting up middleware

require('./server/routes').routes(app,express,passport); //server routes and includes

require('./server/socket').start_socket(io,clients); //start socket

require('./server/oplog').start_oplog(clients);// start oplog to monitor database

var port = process.env.PORT || 3000;
server.listen(port);


