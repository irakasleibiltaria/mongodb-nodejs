// https://github.com/mongodb/node-mongodb-native
// http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html
// https://runnable.com/node-mongodb-native
// http://mongodb.github.io/node-mongodb-native/api-generated/collection.html
// http://docs.mongodb.org/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/

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

  db.createCollection('tickets', {w:1}, function(err, collection) {
      if(err) throw err;
  });

  db.collection("tickets").remove({}, function(err, result){});

  // JSON record
  var event = {_id:"eventname", description:"event description", address:"address of de event"};

  // insert record
  db.collection('tickets').insert(event, {w:1}, function(err, result) {
    if (err) throw err;
    console.log("event insert:" + result[0]._id);
  });

  // JSON records
  var ticket = [{code:"A12", price:5, email:"name@test.com", event_id:"eventname"},
                {code:"B12", price:5, email:"name2@test.com", event_id:"eventname"},
                {code:"C12", price:5, email:"name2@test.com", event_id:"eventname"},
                {code:"D12", price:5, email:"name3@test.com", event_id:"eventname"},
                {code:"E12", price:5, email:"name3@test.com", event_id:"eventname"}
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

  // find all filter
  db.collection('tickets').find({event_id:"eventname"}).toArray(function(err, docs) {
    console.log('eventname tickets:')
    console.dir(docs);
  });


  // findone
  db.collection('tickets').findOne({code:'A12'}, function(err, item) {
    console.dir(item);
    console.log("email: " + item.email);

    db.close();
  });



});

