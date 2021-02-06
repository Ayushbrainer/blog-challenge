
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/blogsDB",{useNewUrlParser:true, useUnifiedTopology: true });

const blogSchema = mongoose.Schema({
  title:String,
  blog:String
})

const Blog = mongoose.model("blog",blogSchema);



const Day1 = Blog({
    title: "Day 1",
    blog: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla maximus risus velit, at fringilla massa pretium viverra. Duis tristique est lorem, eu cursus urna hendrerit vel. Maecenas lacinia in magna at scelerisque. In hac habitasse platea dictumst. Fusce placerat ornare tortor. Integer nec enim vitae leo tristique ultrices. Morbi sollicitudin odio est, eu malesuada felis lobortis et. Morbi justo neque, tristique nec erat ac, ornare lacinia sem. Aenean ut ultricies lacus. Mauris quis enim ac lacus cursus gravida. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam aliquet ut tellus vel faucibus."
  });

const Day2 = Blog({
  title: "Day 2",
  blog: "Etiam arcu nisl, accumsan nec mauris et, pretium dignissim magna. Ut diam tellus, lacinia sed sem vel, finibus scelerisque velit. Cras tempus auctor urna, quis congue leo fringilla id. Praesent urna ex, scelerisque non arcu quis, finibus fermentum risus. Aliquam porta cursus augue. Ut malesuada vehicula ex, sit amet tristique sem ultrices in. Mauris in fermentum felis. Integer et sapien imperdiet, pharetra dolor sed, tincidunt magna. Pellentesque dignissim justo est, a sodales ligula malesuada sed."
});


const blogItems = [Day1,Day2];


app.get("/",function(req,res){

  Blog.find(function(err,blogs) {
    if(!err){
      if(blogs.length===0){
        Blog.insertMany(blogItems,function(err,docs) {
          if(!err){
            console.log("Succesfully saved default blogs");
            res.render("home",{homeStartingContent:homeStartingContent,blogItems:blogItems});
          }else{
            console.log(err);
          }
        })
      }else{
        res.render("home",{homeStartingContent:homeStartingContent,blogItems:blogs});
      }
    }else{
      console.log(err);
    }
  })
  // res.render('home',{homeStartingContent:homeStartingContent,blogItems:blogItems});
});

app.get("/contact",function(req,res) {
  res.render('contact',{contactContent:contactContent});
})


app.get("/compose",function(req,res) {
    res.render('compose');
})

app.post("/",function(req,res) {
  const body = req.body;
  const title = body.title;
  const post = body.post;
  //
  // console.log(title+"\n"+post);
  const document = Blog({
    title:title,
    blog:post
  });
  document.save().then(()=>console.log("Done"));
  // blogItems.push({
  //   title:title,
  //   post:post
  // });

  res.redirect("/");
})


app.get("/about",function(req,res) {
  res.render('about');
})

app.get("/posts/:title",function(req,res) {
  const title = req.params.title;
  // var blogPost;
  // for(var i=0;i<blogItems.length;i++){
  //   if(title===blogItems[i].title){
  //       blogPost = blogItems[i].post;
  //       break;
  //   }
  // }

  Blog.findOne({title:title},function(err,foundBlog){
    if(!err){
        res.render("post",{title:foundBlog.title,post:foundBlog.blog});
    }else{
      console.log(err);
    }
  })

})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
