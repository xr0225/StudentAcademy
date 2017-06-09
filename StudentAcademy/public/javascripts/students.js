var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://xr0225:dlql4248@ds060649.mlab.com:60649/student';

var findRestaurants = function (db, callback) {
    var cursor = db.collection('students').find();
    db.collection('students').find().toArray(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {  
        
                console.dir(doc);
            
            
        } else {
            callback();
        }
    });
};


MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    assert.ok(db != null);
    findRestaurants(db, function () {
        db.close();
    });
});
exports.studentlist = function (active, callback) {
    db.open(function (err, db) {
        if (!err) {
            db.collection('students', function (err, collection) {
                if (!err) {
                    collection.find({
                        'isActive': active
                    }).toArray(function (err, docs) {
                        if (!err) {
                            db.close();
                            var intCount = docs.length;
                            if (intCount > 0) {
                                var strJson = "";
                                for (var i = 0; i < intCount;) {
                                    strJson += '{"name":"' + docs[i].name + '"}'
                                    i = i + 1;
                                    if (i < intCount) {
                                        strJson += ',';
                                    }
                                }
                                //strJson = '{"GroupName":"' + gname + '","count":' + intCount + ',"teams":[' + strJson + "]}"
                                callback("", JSON.parse(strJson));
                            }
                        } else {
                            onErr(err, callback);
                        }
                    }); //end collection.find 
                } else {
                    onErr(err, callback);
                }
            }); //end db.collection
        } else {
            onErr(err, callback);
        }
    }); // end db.open
};