//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const mongoose = require("mongoose");
const https = require('https');


const homeStartingContent = "Thank you for visiting our blog, this is a home of authentic and undiluted news, we give you only the best of best.You are welcome once again.";
const aboutContent = " Tech Journal is one of Ghanas Local And International Tech News Publishing Website, That Seeks To Helps People Of The Country Become Abreast With Currnt Technology trends. The Website Is Open Source , Therefore Tech Enthusiast Can Contrubute To The website By Composing New And Trending Stories";
const contactContent = "Thanks for making time to visit the website. You can reach the developer on Either whatsapp/call on +233501350052. You can also email us on kojoakyer777@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb+srv://kojo_akyer:dzifa123@cluster0.7orfe.mongodb.net/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const blogSchema ={
  title : String,
  body: String
}
const Post = mongoose.model('Post', blogSchema)

const signupSchema ={
  firstName:String,
  lastName:String,
  email:String
}
const Signup = mongoose.model('Signup', signupSchema)

app.get('/', function(req, res){

  Post.find({}, function(err, posts){
    res.render('home',{
      text:homeStartingContent,
      posts:posts
    })
  })
  // res.render('home',{text:homeStartingContent,texttittle:posts})
})

app.get('/weather', function(req, res){

 res.render('weather')

})

app.get('/compose', function(req, res){
  res.render('compose')
})

app.post('/compose', function(req, res){

  const post = new Post({
    title: req.body.posttittle,
    body: req.body.postbody
  })
  post.save(function(err){
     if (!err){
       res.redirect('/');
     }
   });



 // let post = {
 //   title: req.body.posttittle,
 //   body: req.body.postbody
 // }
 // posts.push(post);
 // res.redirect('/')

})

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      body: post.body
    });
  });

});

app.get('/sign-up', function(req, res){
  res.render('sign-up', {})
})

app.get('/success', function(req, res){
  // Signup.find({}, function(err, signups){
  //   if (err) {
  //     console.log(err);
  //
  //   }else {
      res.render('success', {})
    });

  //
  //   });
  //
  // })

  app.post('/', function(req, res){


  const query = req.body.cityName;
  const apiKey = 'f992b83bd287a441512e4c46cac5c43a';
  const units = 'metrics';

  const url = 'https://api.openweathermap.org/data/2.5/weather?q='+query+'&appid='+apiKey+'&'+ 'units='+units;
  https.get(url, function(response){

    response.on('data', function(data){
      const weatherData = JSON.parse(data);

      const temp = weatherData.main.feels_like;
      const pressure = weatherData.main.pressure;
      const icon = weatherData.weather[0].icon;
      const imageUrl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

      return res.render('weather', {
        temp:temp,
        pressure: pressure,
        imageUrl:imageUrl,
        icon:icon,
        query:query



      });
      res.redirect('/weather')

      })
      // res.write('<p> the atmospheric pressure in '+ query+ 'is'+ pressure + '</p>');
      // res.write('<h1> the feels like ' + temp + ' degrees. </h1>');
      // res.write('<img src=' + imageUrl + '>');
      // res.send();
    })
  });



app.post('/sign-up', function(req, res){
  const signup = new Signup({
     firstName:  req.body.fName,
     lastName:   req.body.lName,
     email:  req.body.email
  })

   signup.save(function(err){
     if (!err){
       res.redirect('/success')
     }
   })




});

app.get('/about', function(req, res){
  res.render('about', {textabout:aboutContent})
})

app.get('/contact', function(req, res){
  res.render('contact', {textcontact:contactContent})
})

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started has started");
});
