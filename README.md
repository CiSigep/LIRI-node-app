# LIRI-node-app

This application is a Node.js application making a simple assistant called LIRI for getting movie information, song information, or information about concerts that a band will be playing in the future. The applcation makes use of OMDB's movie search API, bandsintown's Concert search API, and Spotify API for tracks.

# User Interaction

1. User enters one of the following in the terminal:
   * node liri.js concert-this <band-name\>
   * node liri.js movie-this <movie-name\>
   * node liri.js spotify-this-song <song-name\>
   * node liri.js do-what-it-says
2. App will take the commands and retrieve the data from the API that has it and display it to the user.

# Notes
Another version of LIRI that uses inquirer is also available, called by node liri-inquirer.js.
