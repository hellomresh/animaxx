const mongoose = require("mongoose");

const AnimeSchema = new mongoose.Schema({
  title: String,
  genre: String,
  episodes: Number,
  description: String,
  poster: String,
  trailer: String,
  score: Number,
  popularity: Number
});

module.exports = mongoose.model("Anime", AnimeSchema);