'use strict';

var MongoOplog = require('mongo-oplog');     //mongo-oplog library to monitor changes in database.

var oplog = MongoOplog(process.env.MONGO_OPLOG_URI,function(err) {
    if (err){
        console.log('*****Start Mongo database(\'test\') locally at 27017 [ mongod --replSet test ]');
        console.log(err);
    }
}).tail();

exports.start_oplog = function(clients){

//this fucntion keeps running and looks for new logs, as soon as log is recieved here it generates a notification
    oplog.on('op', function (log) {
        console.log(log);
        createNotification(log);
    });

//this function creates the notification to be pushed to all connected clients
    var createNotification = function(log){
        var ns = log.ns.split('.');
        var op = '';
        switch(log.op){

            case 'i':
                op = 'Insert';
                break;
            case 'u':
                op = 'Update';
                break;
            case 'd':
                op = 'Delete';
                break;
            case 'c':
                op = 'Create';
                break;
        }

        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        var date = new Date(log.ts.high_ * 1000);
        var tmpDate = date.getDate()+'-'+monthNames[date.getMonth()]+'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

        var notification =
        {
            db : ns[0],
            col : ns[1],
            op : op,
            time : tmpDate,
            doc:{
                fields:{
                },
                current:{
                },
                previous:{
                }
            }
        };

        var i=0;

        findSubscribers(notification.db,notification.col,function(subscribers){

            subscribers.forEach(function(obj, index){
                var id = obj.id;
                var s_fields = obj.fields;
                var notification_flag = false;
                for(var key in log.o){
                    if(key == "_id"){
                        notification.doc.fields[i]=key;
                        notification.doc.current[i]=log.o[key];
                        notification_flag = true;
                    }
                    else{
                        for(var field in s_fields){
                            if(s_fields[field] == key){
                                notification.doc.fields[i]=key;
                                notification.doc.current[i]=log.o[key];
                                notification_flag = true;
                            }
                            else
                            if(s_fields[field] == 'all'){
                                notification.doc.fields[i]=key;
                                notification.doc.current[i]=log.o[key];
                                notification_flag = true;
                            }
                        }
                    }
                    i++;
                }
                if(notification_flag){
                    //sends personalised notification as per client subscription
                    clients[id].socket.emit('notification',notification);
                }

            });

        });
    };

//this function helps identify clients to send notifications to according to their subscription details stored under array clients
    var findSubscribers = function(db,col,callback){
        var subscribers = [];
        for(var key in clients){
            if(clients[key].database.name == db){
                for(var collectionKey in clients[key].database.collection){
                    var collection = clients[key].database.collection[collectionKey];
                    if(collection.name == col){
                        subscribers.push({"id":key,"fields":collection.fields});

                    }
                }
            }
        }
        callback(subscribers);
    };


};