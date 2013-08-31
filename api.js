// http://mcavage.me/node-restify/
// http://synthmedia.co.uk/blog/basic-nodejs-api-with-restify-and-save#.UiJTO3MW026

var express = require('express');

var app = express();

app.get('/tickets', function(req, res) {
    res.send([{code:'1'}, {code:'2'}]);
});
app.get('/tickets/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
});

app.listen(3000);
console.log('Listening on port 3000...');


