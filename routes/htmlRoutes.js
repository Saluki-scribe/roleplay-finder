var express = require("express");
var app = express();

    
    app.get("/", function(req, res) {
        res.render("index", {});
    });

    app.get("/test", function(req, res) {
        res.send("I love you! (Not really. This is just a test.)")
    })

    

module.exports = app;