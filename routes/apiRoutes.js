const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(app){
    // A GET route for scraping the Tech Crunch website
    app.get("/api/scrape", function(req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://techcrunch.com/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        //array to store all the articles
        const articles = [];
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

            articles.push(result);

        });
        return articles;
        }).then(function(articles){
            // Create a new Article using the `result` object built from scraping
            db.Article.create(articles)
            .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
                res.json({completed: true});
            })
            .catch(function(err) {
                // If an error occurred, log it
                res.json(err);
            });
        });
    });

    app.put("/api/article/:id", (req, res) => {
        console.log(req.body);
        return db.Article.updateOne({_id: req.params.id}, {$set: {saved: req.body.saved}})
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });    

    });

        
    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        db.Comment.create(req.body)
            .then(function(dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { comment: dbNote._id }}, { new: true });
            })
            .then(function(dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
        });
    });
};