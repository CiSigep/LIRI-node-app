console.log("Keys loaded");

var keys = {};

keys.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET 
};

keys.OMDB = {
    key: process.env.OMDB_KEY
};

keys.bandsintown = {
    app_id: process.env.BANDSINTOWN_ID
};

module.exports = keys;

