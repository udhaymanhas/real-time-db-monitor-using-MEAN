var UserDaemon = require('../models/userDeamonModel');

exports.update = function(req, res){
    callback = function(err,value){
        if(err){
            console.log('*****Error updating user subscription in collection user_daemon.');
            console.log(err);
            res.status(404)
                .send('Error updating subscription.');
        }else{
            res.send(value);
        }
    };

    options = {
        upsert: true
    };

    if(req.body.typeUpdate == 'collection'){
        //push the collection itself
        conditions = {
            "uid": req.body.uid,
            "database.name": "test"
        };
        updates = {
            $push: {
                "database.collection": req.body.collection
            }
        };

        UserDaemon.update(conditions, updates, options, callback);
    }
    else
    if(req.body.typeUpdate == 'field'){
        //push only the fields

        conditions = {
            "uid": req.body.uid
        };

        var nowInsert = function(){
            UserDaemon.update( conditions, { $push:{"database.collection":{
                "name":req.body.collection.name,
                "fields":req.body.collection.fields
            }} },callback )
        };

        UserDaemon.update( conditions, { $pull:{"database.collection":{"name":req.body.collection.name}} },nowInsert );
    }
};

