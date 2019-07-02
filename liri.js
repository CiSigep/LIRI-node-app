require("dotenv").config();
var axios = require("axios");
var spotify = require("node-spotify-api");
var moment = require("moment");
var keys = require("./keys.js");

// Return a function that will work for our find functions for movie ratings.
function findByRater(rater) {
    return function(ele) {
        return rater === ele.Source;
    }
}

// Get our arguments
var args = process.argv.slice(2);

switch(args[0]){
    case "movie-this":
        var movie = "Mr.+Nobody";
        if(args.length > 1){
            movie = args[1];

            for(var i = 2; i < args.length; i++){
                movie += "+" + args[i];
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
        var band = args[1];
        for(var i = 2; i < args.length; i++){
            band += " " + args[i];
        }

        // Replace special characters mention in documentation
        band.replace("/", "%252F");
        band.replace("?", "%253F");
        band.replace("*", "%252A");
        band.replace("\"", "%27C");

        axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=" + keys.bandsintown.app_id).then((res) => {
            console.log("-----BAND EVENTS-----");    
            for(var i = 0; i < res.data.length; i++){
                var venueName = res.data[i].venue.name;
                var location = res.data[i].venue.city + ", " + res.data[i].venue.country;
                var date = moment(res.data[i].datetime);

                console.log("Venue: %s\nLocation: %s\nDate: %s", venueName, location, date.format("MM/DD/YYYY"));    
                
                if(i < res.data.length - 1)
                    console.log("--");
            }
            console.log("----------");
        }).catch((err) => {
            console.log("An error has occurred: " + err);
        });
        break;
    default:
        console.log("I don't understand that command.");
}