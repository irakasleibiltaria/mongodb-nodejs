// https://github.com/mongodb/node-mongodb-native
// http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html
// https://runnable.com/node-mongodb-native
// http://mongodb.github.io/node-mongodb-native/api-generated/collection.html
// http://docs.mongodb.org/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/
// http://docs.mongodb.org/manual/reference/command/findAndModify/

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
  db.collection("events").remove({}, function(err, result){});
  // JSON record
  var event = {_id:"eventname", description:"event description", address:"address of de event"};
  // insert record
  db.collection('events').insert(event, {w:1}, function(err, result) {
    if (err) throw err;
    console.log("event insert:" + result[0]._id);
  });


  db.createCollection('tickets', {w:1}, function(err, collection) {
      if(err) throw err;
  });
  db.collection("tickets").remove({}, function(err, result){});
  // JSON records
  var ticket = [{code:"0", price:5, email:"name@test.com", event_id:"eventname"},
                {code:"3", price:5, email:"name2@test.com", event_id:"eventname"},
                {code:"5", price:5, email:"name2@test.com", event_id:"eventname"},
                {code:"7", price:5, email:"name3@test.com", event_id:"eventname"},
                {code:"9", price:5, email:"name3@test.com", event_id:"eventname"}
                ];
  // insert records
  db.collection('tickets').insert(ticket, {w:1}, function(err, result) {
    if (err) throw err;
    console.log("event insert:" + result[0]._id);
  });

  // find all
  db.collection('tickets').find().toArray(function(err, docs) {
    console.dir(docs);
    console.log("email: " + docs[0]._id);
  });

  // find all filter
  db.collection('tickets').find({email:"name2@test.com"}).toArray(function(err, docs) {
    console.dir(docs);
  });

  // find all tickets and return only 'email' field (1: include, 0: exclude)
  // http://docs.mongodb.org/manual/reference/method/db.collection.find/ (proyection)
  db.collection('tickets').find({}, {fields:{email:1, _id:0}}).toArray(function(err, docs) {
    console.log('-----------tickets email:')
    console.dir(docs);
  });

  // find all distinct emails
  db.collection('tickets').distinct('email', function(err, docs) {
    console.log('-----------distinct tickets email:')
    console.dir(docs);
  });

  // findone
  db.collection('tickets').findOne({code:'A12'}, function(err, item) {
    console.dir(item);
    console.log("email: " + item.email);
  });

  // findandmodify insert new field
  db.collection('tickets').findAndModify({code:'A12'}, [], {$set:{"QRcode":"9999"}}, {new:true}, function(err, doc) {
    console.log("QR:");
    console.log(doc);
  });

  // find all tickets that contain QR field
  // http://docs.mongodb.org/manual/reference/operator/exists/
  db.collection('tickets').find({QRcode:{$exists:true}}).toArray(function(err, docs) {
    console.log('-----------tickets with QR code:')
    console.dir(docs);
  });

  //

  // TODO: indexing

});

