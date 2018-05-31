var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expresssSanitizer = require("express-sanitizer");

// App config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expresssSanitizer());
app.use(methodOverride("_method"));


// Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1523259567658-1edd091b6d9f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8b757242b834d2d0c774b6cb90ebde81&auto=format&fit=crop&w=500&q=60",
//     body: "Hello this is a blog post!"
// });

//RESTful Routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// Index Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});


// New Route
app.get("/blogs/new", function(req, res){
    res.render("new");
});


// Create Route
app.post("/blogs", function(req, res){
    // Sanitize body of text area
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
    // then, redirect to the index
});

// Show Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
    
});


// Update Route
app.put("/blogs/:id", function(req, res){
    // Sanitize body of text area
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


// Destroy Route
app.delete("/blogs/:id", function(req, res){
    // Destroy Blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
    // redirect somewhere
});



app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("The Blog App is running!");
});