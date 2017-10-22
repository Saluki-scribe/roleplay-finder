var express = require("express");
var app = express();

    
    app.get("/api", function(req, res) {
        res.send("This api route works!");
    });
    

module.exports = app;