'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserDeamonSchema = new Schema({
    uid: String,
    database: {
        name:String,
        collection: [{
            name:String,
            fields:{}
        }]
    }
});

module.exports = mongoose.model('User_deamon', UserDeamonSchema);