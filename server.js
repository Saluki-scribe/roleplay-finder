var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//Require scraping tools

var axios = require("axios");
var cheerio = require("cheerio");

//Require models

//var db = require("./models");

var PORT = 3000;

var app = express();

//=========================
//-------Middleware--------
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

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/week18Populater", {
  useMongoClient: true
});

//=========================
//---------ROUTES----------
//=========================

//var routes = require("./controllers/routes.js")
//var userRoutes = require("./controllers/userController.js");

app.get("/", function(req, res) {
    res.render("index", {});
})


app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});