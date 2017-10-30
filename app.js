var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");
var app = express();

mongoose.connect("mongodb://localhost/restful_blog_app");

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//Mongoose/ model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);
/*
Blog.create({
    title:"test blog",
    image: "http://www.behindthevoiceactors.com/_img/actors/daniel-wu-50.6.jpg",
    body: "Hello this is a blog post"
});
*/
//ROUTES
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs: blogs});
        }
    });
    
});

//create new form route
app.get("/blogs/new",function(req, res) {
    res.render("new");
});

//create new post request
app.post("/blogs", function(req, res){
    //create a new blog then add to the database
    if(req.body.blog.title == ""||req.body.blog.image ==""||req.body.blog.body==""){
        res.send("Every field need to fill up");
    }
    else{
        Blog.create(req.body.blog, function(err, blog){
            if(err){
                console.log(err);
            }
            else{
                //redirect to the index page
                res.redirect("/blogs");
            }
        });
    }
});

//create a show template
app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("index");
        }
        else{
            res.render("show",{blog : foundBlog});  
            console.log("post request");
        }
    });
});

//edit route("/blogs/:id/edit") get 
app.get("/blogs/:id/edit",function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("index");
        }
        else{
            res.render("edit",{blog : foundBlog});  
            
        }
    });
});
//create edit form==done

//update route(/blogs/:id) PUT form a form
app.put("/blogs/:id", function(req,res){
    //find the blog._id then update it
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err, blog){
        if(err){
            res.redirect("index");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//create update form: done

//create delete request
app.delete("/blogs/:id", function(req,res){
    //remove blog then redirect to the index
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }
        else 
        {
            console.log(req.params.id + "is removed!");
            res.redirect("/blogs");   
        }
    });
});

app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server connected");
});

