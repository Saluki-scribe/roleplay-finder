//=========================
//-------DEPENDENCIES--------
//=========================

var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var app = express();

//Require scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//Require models
var db = require("./models");

//Establish port connection 
var PORT = 3000;

//=========================
//-------MIDDLEWARE--------
//=========================

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Establish Handlebars as template

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//=========================
//-------MONGOOSE--------
//=========================

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/roleplaydb", {
  useMongoClient: true
});

//=========================
//---------ROUTES----------
//=========================

//var htmlRoutes = require("./routes/htmlRoutes.js")
//var userRoutes = require("./routes/apiRoutes.js");

//app.use("/", htmlRoutes);
//app.use("/", userRoutes);


app.get("/", function(req, res) {
    res.render("index", {});
});

app.get("/api", function(req, res) {
    res.send("This api route works!");
});




app.get("/roleplays", function(req, res) {
    // Grab every document in the Articles collection
    db.Roleplay
      .find({})
      .then(function(dbRoleplay) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbRoleplay);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });




app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});