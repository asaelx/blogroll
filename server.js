//Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Connect MongoDB
mongoose.connect('mongodb://localhost/blogroll');

//Declare Schema
var Schema = mongoose.Schema;

//Create new Schema for Blog
var BlogSchema = new Schema({
    author: String,
    title: String,
    url: String
});

//Assign Schema to Blog Model on Mongoose
mongoose.model('Blog', BlogSchema);

//Assign Mongoose Model to Blog
var Blog = mongoose.model('Blog');

//Create new blog for testing and creation of the database
// var blog = new Blog({
//     author: "Michael",
//     title: "Michael's Blog",
//     url: "http://michaelsblog.com"
// });
//
// blog.save();

//Declare app with express
var app = express();

//Declare public folder to serve static content
app.use(express.static(__dirname + '/public'));

//Use bodyparser to handle JSON
app.use(bodyParser.json());

//Routes

//Home
app.get('/api/blogs', function(req,res){

    //Get all blogs from database
    Blog.find(function(err, docs){
        //Console all records
        docs.forEach(function(item){
            console.log('Received a GET request for _id: ' + item._id);
        });
        //Send records to the view
        res.send(docs);
    });
});

//Create a new blog
app.post('/api/blogs', function(req,res){

    console.log('Received a POST request');

    //Console log all the request
    for(var key in req.body){
        console.log(key + ': ' + req.body[key]);
    }

    //Create new blog
    var blog = new Blog(req.body);

    //Save blog with Mongoose
    blog.save(function(err, doc){
        //Send doc to view
        res.send(doc);
    });
});

//Delete a blog
app.delete('/api/blogs/:id', function(req, res){

    console.log('Received a DELETE request for _id: ' + req.params.id);

    //Blog model remove item
    Blog.remove({_id: req.params.id}, function(err){
        res.send({_id: req.params.id});
    });
});

//Update a blog
app.put('/api/blogs/:id', function(req,res){

    console.log('Received an UPDATE request for _id: ' + req.params.id);

    //Blog model update item
    Blog.update({_id: req.params.id}, req.body, function(err){
        res.send({_id: req.params.id});
    });
});

//Listen on port 3000
var port = 3000;
app.listen(port);

console.log('Server on http://localhost:' + port);
