// https://github.com/mongodb/node-mongodb-native
// http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html
// https://runnable.com/node-mongodb-native
// http://mongodb.github.io/node-mongodb-native/api-generated/collection.html

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// read user:password from command line : http://nodejs.org/docs/latest/api/process.html#process_process_argv
// $ node app.js <USER> <PASSWORD> <DATABASE>
var user
  , password
  , database;

process.argv.forEach(function(val, index, array) {
  user = array[2];
  password = array[3];
  database = array[4];
});

console.log('user:' + user);
console.log('password:' + password);
console.log('database:' + database);

// Connect to the db
MongoClient.connect('mongodb://'+user+':'+password+'@ds043168.mongolab.com:43168/'+database, function(err, db) {
  if(err) throw err;

  console.log("We are connected");

  db.createCollection('events', {w:1}, function(err, collection) {
      if(err) throw err;
  });

  // delete record
  db.collection('events').remove({_id: 'test'}, {w:1}, function(err, numberOfRemovedDocs){});

  // JSON record
  var event = {_id:"test", name:"test event", tickets: [{id:"A12", price:"5"}, {id: "B11", price: "5"}]};

  // insert record
  db.collection('events').insert(event,  {w:1}, function(err, result) {
    if (err) throw err;
    console.log("event insert:" + result[0]._id);
  });

  // Count the number of records
  db.collection('events').count(function(err, count) {
    console.log("There are " + count + " records.");
  });

  // Peform a simple find and return all the documents
  db.collection('events').find().toArray(function(err, docs) {
    console.log(docs);
    //close
    db.close();
  });

  // // find
  // var stream = db.collection('events').find({_id:'test'}}).stream();
  // stream.on("data", function(item) { console.log("item:" + item); });
  // stream.on("end", function() { console.log("end") });

});

