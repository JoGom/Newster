const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const PORT = 3000;
// Initialize Express
const app = express();
// Require all models
const db = require("./models");

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes

// require controller
require('./controllers/newsController.js')(app);
require('./controllers/scrapeController.js')(app)


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
