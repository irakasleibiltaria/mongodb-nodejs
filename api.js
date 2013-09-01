// http://expressjs.com/api.html
// http://webapplog.com/intro-to-express-js-simple-rest-api-app-with-monk-and-mongodb/
// http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/
// http://erichonorez.wordpress.com/2013/02/10/how-create-a-rest-api-with-node-js-and-express/
// http://thewayofcode.wordpress.com/2013/04/21/how-to-build-and-test-rest-api-with-nodejs-express-mocha/

var express = require('express');
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
// $ node app.js <USER> <PASSWORD> <DATABASE>
var user, password, database;

process.argv.forEach(function(val, index, array) {
  user = array[2];
  password = array[3];
  database = array[4];
});

MongoClient.connect('mongodb://'+user+':'+password+'@ds043168.mongolab.com:43168/'+database, function(err, db) {
  if(err) throw err;
  console.log("database connected");

  var app = express();

  app.get('/tickets', function(req, res) {
    // res.send([{code:'1'}, {code:'2'}]);

    // find all
    db.collection('tickets').find().toArray(function(err, docs) {
      // res.send(docs);
      res.json(docs);
    });
  });


  app.get('/tickets/:id', function(req, res) {
    // res.send({id:req.params.id, name: "The Name", description: "description"});

    // find one
    var query = {code:req.params.id};
    // db.collection('tickets').findOne({code:'XXXX'}, function(err, item) {
    db.collection('tickets').findOne(query, function(err, item) {
      console.log(item);
      // res.send(item);
      res.json(item);
    });
  });

  app.listen(3000);
  console.log('Listening on port 3000...');

});

