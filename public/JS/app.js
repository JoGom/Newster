$(document).ready(function() {

    $(document).on("click", "#saveArticle", function(){
        const thisId = $(this).attr("data-id");
        console.log(thisId);
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "PUT",
            url: "/api/article/" + thisId,
            data: {
            // Value taken from note textarea
            saved: true
            }
        })
            // With that done
            .then(function(data) {
            // Log the response
            
            console.log(data);
            // Empty the notes section
            });
    });
    $(document).on("click", "#scrapeBtn", function(){
 
        $.ajax({
            method: "GET",
            url: "/api/scrape",
        })
            // With that done
            .then(function(data) {
            // Log the response
            location.reload();
            console.log(data);
            // Empty the notes section
            });
    });

    $(document).on("click", "#unsaveArticle", function(){
        const thisId = $(this).attr("data-id");
        console.log(thisId);
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "PUT",
            url: "/api/article/" + thisId,
            data2: {
            // Value taken from note textarea
            saved: false
            }
        })
            // With that done
            .then(function(data) {
            // Log the response
            location.reload();
            console.log(data);
            // Empty the notes section
            });
    });

    $(document).on("click", "#commentBtn", function(){
        const thisId = $(this).attr("data-id");
        console.log(thisId);
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
            // Value taken from note textarea
            body: $("#bodyinput").val()
            }
        })
            // With that done
            .then(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
            });
        
        // Also, remove the values entered in the input and textarea for note entry
        // $("#bodyinput").val("");
    });
    







});