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
var PORT = process.env.PORT || 3000;

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
mongoose.connect("mongodb://heroku_g0nxkmcv:7bv562tdmp4565v35a5htj3as9@ds125565.mlab.com:25565/heroku_g0nxkmcv");

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


// A GET route for scraping the roleplay forum website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.rpnation.com/forums/fantasy.12/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("h3.title").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        
        db.Roleplay
          .create(result, function (dbRoleplay) {
                    console.log(result)
  
          })
          .then(function(dbRoleplay) {
            // If we were able to successfully scrape and save an Article, send a message to the client
             res.send("<h1>Scrape Complete!</h1>");
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
             res.json(err);
          });
      });
    });
  });

app.get("/roleplays", function(req, res) {
    // Grab every document in the Articles collection
    db.Roleplay
      .find({})
      .then(function(roleplay) {
        // If we were able to successfully find Articles, send them back to the client
        res.render("index", {roleplay});
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


// Route for grabbing a specific Article by id, populate it with its note
app.get("/roleplays/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Roleplay
      .findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbRoleplay) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbRoleplay);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/roleplays/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note
      .create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Roleplay.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbRoleplay) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbRoleplay);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get("/saved", function(req, res) {
      // Grab every document in the Articles collection
    db.Roleplay
    .find({})
    .then(function(roleplay) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("saved", {roleplay});
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  })

app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});