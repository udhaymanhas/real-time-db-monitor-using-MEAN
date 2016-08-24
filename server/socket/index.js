'use strict';

var UserDeamon = require('../models/userDeamonModel'); //model for user subscriptions

exports.start_socket = function(io,clients){

    io.sockets.on('connection', function(socket){
        //this is where socket is initialized and it recieved user id and updates info about users/clients and their subscriptions
        socket.on('uid', function(uid){
            var daemon={};
            UserDeamon.findOne({"uid":uid},'database',function(err,data){
                if(err) {console.log('err............');}
                if(!data) {console.log('No deamon exits............ creating deamon');
                    clients[uid]={
                        "socket":socket,
                        "databse":''
                    };
                }
                else{
                    console.log('Client Connected: Verified');
                    //deamon = data.database;
                    clients[uid]={
                        "socket":socket,
                        "database":data.database
                    };
                }

            });

        })
    });
};