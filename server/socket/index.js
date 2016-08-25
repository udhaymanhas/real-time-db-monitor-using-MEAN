'use strict';

var UserDeamon = require('../models/userDeamonModel'); //model for user subscriptions

exports.start_socket = function(io,clients){

    io.sockets.on('connection', function(socket){
        //this is where socket is initialized and it recieves user id and updates info about users/clients and their subscriptions
        socket.on('uid', function(uid){
            socket.uid = uid;
            UserDeamon.findOne({"uid":socket.uid},'database',function(err,data){
                if(err) {console.log('err............');}
                if(!data) {console.log('No deamon exits............ creating deamon');
                    clients[socket.uid]={
                        "socket":socket,
                        "databse":''
                    };
                }
                else{
                    console.log('Client Connected: Verified');
                    clients[socket.uid]={
                        "socket":socket,
                        "database":data.database
                    };
                }

            });

        });

        socket.on('disconnect', function(data){
            if(!socket.uid) return;
            delete clients[socket.uid];
        });
    });
};