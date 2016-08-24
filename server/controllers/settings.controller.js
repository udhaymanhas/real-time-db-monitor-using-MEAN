var mongo = require('mongodb');

var MongoClient = mongo.MongoClient;
var url = process.env.MONGO_REPL_URI;

exports.settings = function(req, res) {

    var settings = [
        {
            database:{
                name:"test",
                collections:[
                ]
            }
        }
    ];

    var flag = 0;
    var settings_flag = 0;
    var col_count = 0;

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('*****Start Mongo database(\'test\') locally at 27017 [ mongod --replSet test ]******');

            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            db.listCollections().toArray(function(err, collections){
                col_count = collections.length;
                if(err){
                    res.status(404)
                        .send(err);
                }
                else{
                    if(col_count == 0){
                        res.status(404)
                            .send('No collections Found! No setting to fetch!');
                    }
                    else{
                        collections.forEach(function(collection,index){

                            db.collection(collection.name).findOne({},function(err,doc){
                                ++flag;
                                if(err){
                                    console.log('ERROR inside collection find(). Collection Name:' + collection.name);
                                    console.log(err);
                                }
                                else
                                if(doc == null){
                                    console.log('****No documents Found! Empty Collection! Collection Name: '+ collection.name);
                                }
                                else{
                                    settings[0].database.collections.push(
                                        {
                                            "name":collection.name,
                                            "fields":Object.keys(doc)
                                        }
                                    );
                                    ++settings_flag;
                                }
                                if(col_count == flag){
                                    if(settings_flag==0){
                                        res.status(404)
                                            .send('No Settings to load.Possibly 0 documents in all the collections.Please update collections with at least one document each.Check Server logs.');
                                    }
                                    else{
                                        res.json({"settings":settings});
                                    }
                                }
                            });
                        });
                    }

                }

            });
        }
    });

};