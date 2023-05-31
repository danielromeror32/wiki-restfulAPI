const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const Article =  require(__dirname + "/model/articles.js"); 

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB'); 

app.route("/articles")

.get(function(req, res){
  Article.find({}).then(foundArticles =>{
      //console.log(foundArticles);
      res.send(foundArticles);
  }).catch((error) => {
      // console.error('Error to find the articles:', error);
      res.send('Error to find the articles:', error);
  });
})

.post(function(req, res){
  const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
  });
  newArticle.save().then(() => {
      console.log('Post added to DB.');
      res.redirect('/');
    })
    .catch(err => {
      res.status(400).send("Unable to save post to database.");
    });
})

.delete(function(req, res){
  Article.deleteMany().then(() => {
    res.send("Successfully delete all articles.");
  }).catch(err => {
    res.send(err);
  });
});
// -------------- 

app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}).then((foundArticle) => {
    res.send(foundArticle);
  }).catch(err => {
    res.send(err);
  });
})

.put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content}).then(() => {
      res.send("Successfully");
    }).catch(err => {
      res.send(err);
    });
})

.patch(function (req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body}
  ).then(() => {
    res.send("Successfully updated article");
  }).catch(err => {
    res.send(err);
  });
  })

.delete(function(req, res){
  Article.deleteOne({title: req.params.articleTitle}).then(() => {
    res.send("Successfully updated article");
  }).catch(err => {
    res.send(err);
  });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });