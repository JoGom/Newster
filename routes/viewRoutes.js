const db = require("../models");

module.exports = function(app){
    // Route for getting all Articles from the db
    app.get("/", function(req, res) {
        // Grab every document in the Articles collection
        db.Article.find({}).sort({created_at: -1})
            .then(function(dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                const articleObj = {
                    article: dbArticle
                };
                // console.log(`article objecy ${articleObj.article}`);
                res.render("index", articleObj);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
        });
    });
    app.get("/saved", function(req, res) {
        db.Article.find({saved: true})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            const articleObj = {
                article: dbArticle
            };
            // console.log(`article objecy ${articleObj.article}`);
            res.render("saved", articleObj);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });


    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function(dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
        });
    });

};