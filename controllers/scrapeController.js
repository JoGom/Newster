const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(app){
    // A GET route for scraping the echoJS website
    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://techcrunch.com/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);
        // Now, we grab every h2 within an article tag, and do the following:
        $(".post-block--unread", ".river").each(function(i, element){
            // Save an empty result object
            const result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
            .find(".post-block__title__link")
            .text()
            .replace(/\s\s+/g, '');

            result.link = $(this)
            .find(".post-block__title__link")
            .attr("href");

            result.author = $(this)
            .find(".river-byline__authors")
            .text()
            .replace(/\s\s+/g, '');
   
            result.description = $(this)
            .find(".post-block__content")
            .text()
            .replace(/\s\s+/g, '');
         
            result.image = $(this)
            .find("img")
            .attr("src");
            console.log(result);

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
            .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
            });
        });
    
        // Send a message to the client
        res.send("Scrape Complete");
        });
    });
};