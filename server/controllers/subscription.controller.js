var UserDaemon = require('../models/userDeamonModel');

exports.subscription = function(req, res){

    UserDaemon.findOne({'uid':req.body.uid},function(err,event){
        if(err){
            console.log('UserDaemon.findOne() error. For user uid:'+req.body.uid);
            res.status(404)
                .send('There is some error with user subscription model!.Shutting Down.');
            throw err;
        }

        if(event){
            res.json(event);
        }
        else{
            var newDaemon = new UserDaemon();
            newDaemon.uid = req.body.uid;
            newDaemon.database = {
                name:"test",
                collection:[]
            };

            newDaemon.save(function (err, result) {
                if(err){
                    console.log('Cannot create user subscription daemon for user. uid:'+ req.body.uid );
                    console.log(err);
                    res.status(404)
                        .send('There is some error with your account!');
                }
                else{
                    res.json(result);
                }
            });
        }
    });

};