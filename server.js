// Dependencies
const express = require("express");
const mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");


const path = require("path");

// Initialize Express
const app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
const databaseUrl = "scrapedMovies";
const collections = ["scrapedData"];

// Hook mongojs configuration to the db constiable
const db = mongojs(databaseUrl, collections);

db.scrapedData.drop();

db.on("error", function (error) {
    console.log("Database Error:", error);
});

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    // res.send("Welcome to the Star Wars Page!")
    res.sendFile(path.join(__dirname, "public/index.html"));
  });

// at the /all path disply every item in the sracpedData collection
app.get("/all", function(req, res) {
    //query: in our database, go the scrapedData collection, then "find" everything
    db.scrapedData.find({}, function(error, found) {
        //log any errors if the server encouters one
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

// Retrieve data from the db and show json
app.get("/api/all", function (req, res) {
    // Find all results from the scrapedData collection in the db
    db.scrapedData.find({}, function (error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }
    });
});



// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
    // Make a request via axios for the news section of `ycombinator`
    axios.get("https://www.imdb.com/filmosearch/?explore=title_type&role=nm0000115&ref_=filmo_vw_adv&mode=advanced&page=1&title_type=movie&sort=moviemeter,asc").then(function (response) {
        // Load the html body from axios into cheerio
        const $ = cheerio.load(response.data);
        
        // For each element with a "title" class
        $("h3.lister-item-header").each(function (i, element) {
            // Save the text and href of each link enclosed in the current element
            const title = $(element).find('a').text();
            const link = $(element).find('a').attr('href');

            // If this found element had both a title and a link
            if (title && link) {
                // Insert the data in the scrapedData db
                db.scrapedData.insert({
                        title: title,
                        link: link
                    },
                    function (err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        } else {
                            // Otherwise, log the inserted data
                            console.log(inserted);
                        }
                    });
            }
        });
    });

    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});

// 3. At the "/name" path, display every entry in the animals collection, sorted by name
app.get("/name", function(req, res) {
    // Query: In our database, go to the animals collection, then "find" everything,
    // but this time, sort it by name (1 means ascending order)
    db.scrapedData.find().sort({ title: 1 }, function(error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
  });

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});