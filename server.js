var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blogroll');

var Schema = mongoose.Schema;

var BlogSchema = new Schema({
    author: String,
    title: String,
    url: String
});

mongoose.model('Blog', BlogSchema);

var Blog = mongoose.model('Blog');

var blog = new Blog({
    authot: "Michael",
    title: "Michael's Blog",
    url: "http:://michaelsblog.com"
});

blog.save();

var app = express();

app.use(express.static(__dirname + '/public'));

var port = 3000;

app.listen(port);

console.log('Server on ' + port);
