require("dotenv").config();
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var fs = require("fs");
var keys = require("./keys.js");

// Return a function that will work for our find functions for movie ratings.
function findByRater(rater) {
    return function (ele) {
        return rater === ele.Source;
    }
}
// Print out our tracks
function printTracks(tracks) {

    if (tracks.length > 1)
        console.log("-----TRACKS-----");
    else
        console.log("-----TRACK-----");

    for (var j = 0; j < tracks.length; j++) {

        var artists = ""

        for (var i = 0; i < tracks[j].artists.length; i++) {
            artists += tracks[j].artists[i].name;

            if (i < tracks[j].artists.length - 1) {
                artists += ", "
            }
        }

        console.log("Artists: %s\nName: %s\nPreview: %s\nAlbum: %s", artists, tracks[j].name, tracks[j].preview_url, tracks[j].album.name);

        if (j < tracks.length - 1)
            console.log("--");
    }
    console.log("----------");
}

// Get our arguments
var select =  process.argv[2];
var args = process.argv.slice(3);

function selectOption(option, queryTokens) {
    switch (option) {
        case "movie-this":
            var movie = "Mr.+Nobody";
            if (queryTokens.length > 0) {
                movie = queryTokens[0];

                for (var i = 1; i < queryTokens.length; i++) {
                    movie += "+" + queryTokens[i];
                }
            }
            axios.get("http://www.omdbapi.com/?t=" + movie + "&plot=short&apikey=" + keys.OMDB.key).then((res) => {
                // Get our ratings
                var imdb = res.data.Ratings.find(findByRater("Internet Movie Database")).Value;
                var rt = res.data.Ratings.find(findByRater("Rotten Tomatoes")).Value;

                // String format
                console.log("-----MOVIE-----");
                console.log("Title: %s\nYear: %i\nIMBD Rating: %s\nRotten Tomatoes Rating: %s\nCountry: %s\nLanguage: %s\nPlot: %s\nActors: %s\n----------", res.data.Title, res.data.Year, imdb, rt, res.data.Country, res.data.Language, res.data.Plot, res.data.Actors);

            }).catch((err) => {
                console.log("An error has occurred: " + err);
            });
            break;
        case "concert-this":
            var band = queryTokens[0];
            for (var i = 1; i < queryTokens.length; i++) {
                band += " " + queryTokens[i];
            }

            // Replace special characters mentioned in documentation
            band.replace("/", "%252F");
            band.replace("?", "%253F");
            band.replace("*", "%252A");
            band.replace("\"", "%27C");

            axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=" + keys.bandsintown.app_id).then((res) => {
                console.log("-----BAND EVENTS-----");
                for (var i = 0; i < res.data.length; i++) {
                    var venueName = res.data[i].venue.name;
                    var location = res.data[i].venue.city + ", " + res.data[i].venue.country;
                    var date = moment(res.data[i].datetime);

                    console.log("Venue: %s\nLocation: %s\nDate: %s", venueName, location, date.format("MM/DD/YYYY"));

                    if (i < res.data.length - 1)
                        console.log("--");
                }
                console.log("----------");
            }).catch((err) => {
                console.log("An error has occurred: " + err);
            });
            break;
        case "spotify-this-song":
            var spotify = new Spotify(keys.spotify);
            var trackName = "The Sign"; // Default Case
            if (queryTokens.length > 0) {
                trackName = queryTokens[0];
                for (var i = 1; i < queryTokens.length; i++) {
                    trackName += " " + queryTokens[i];
                }
            }

            spotify.search({ type: "track", query: trackName }).then((res) => {
                var track = res.tracks.items.find((ele) => trackName.toLowerCase() === ele.name.toLowerCase());
                // Track name match found
                if (track) {
                    console.log("I found this match");
                    printTracks([track]);
                }
                else {
                    console.log("I couldn't find an exact match, here's some results from spotify's search");
                    printTracks(res.tracks.items.slice(0, 10));
                }

            }).catch((err) => {
                console.log("An error has occurred: " + err);
            });

            break;
        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", (err, data) => {
                if (err)
                    return console.log(err);

                // Split our options
                var choices = data.split(",");

                // Pick one
                var choice = choices[Math.floor(Math.random() * choices.length)];
                var choiceTokens = choice.split(" ");
                
                // Display it to the user then run it
                console.log(choice);
                selectOption(choiceTokens[0], choiceTokens.slice(1));
            });
            break;
        default:
            console.log("I don't understand that command.");
    }
}

selectOption(select, args);