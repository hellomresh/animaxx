const Anime = require("../models/Anime");
const axios = require("axios");


// GET all anime from database
exports.getAnime = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 25;

    const anime = await Anime.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(anime);

  } catch (error) {
    res.status(500).json({ message: "Error fetching anime" });
  }
};


// ADD anime manually
exports.addAnime = async (req, res) => {
  try {
    const anime = new Anime(req.body);
    await anime.save();
    res.json(anime);
  } catch (error) {
    res.status(500).json({ message: "Error adding anime" });
  }
};


// GET anime by ID
exports.getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    res.json(anime);
  } catch (error) {
    res.status(500).json({ message: "Anime not found" });
  }
};


// DELETE anime
exports.deleteAnime = async (req, res) => {
  try {
    await Anime.findByIdAndDelete(req.params.id);
    res.json({ message: "Anime deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};


// FETCH anime directly from API (no DB save)
exports.fetchAnimeFromAPI = async (req, res) => {
  try {
    const response = await axios.get("https://api.jikan.moe/v4/anime");
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching external anime" });
  }
};


// IMPORT anime into MongoDB (multiple pages)
exports.importAnime = async (req, res) => {
  try {

    const pagesToImport = 400; // 40 pages = 1000 anime

    for (let page = 1; page <= pagesToImport; page++) {

      console.log(`Importing page ${page}...`);

      const response = await axios.get(
        `https://api.jikan.moe/v4/anime?page=${page}`
      );

      const animeList = response.data.data;

      for (let anime of animeList) {
        await Anime.updateOne(
 { title: anime.title },
 {
   title: anime.title,
   genre: anime.genres.map(g => g.name).join(", "),
   episodes: anime.episodes,
   description: anime.synopsis,
   poster: anime.images.jpg.image_url,
   trailer: anime.trailer?.embed_url || null,
   score: anime.score,
   popularity: anime.popularity
 },
 { upsert: true }
);

      }

      // delay to avoid API rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));

    }

    res.json({ message: "Anime import completed" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Import failed" });
  }
};
exports.searchAnime = async (req, res) => {
  try {
    const query = req.query.q;

    const anime = await Anime.find({
      title: { $regex: query, $options: "i" }   // case-insensitive search
    }).limit(25);

    res.json(anime);

  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};
// GET trending anime
exports.getTrendingAnime = async (req, res) => {

  try {

    const anime = await Anime.find()
      .sort({ _id: -1 })
      .limit(10);

    res.json(anime);

  } catch (error) {
    res.status(500).json({ message: "Trending fetch failed" });
  }

};
exports.getTrendingLive = async (req, res) => {

  try {

    const response = await axios.get(
      "https://api.jikan.moe/v4/seasons/now"
    );

    res.json(response.data.data);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching trending anime"
    });

  }

};
exports.getTopAnime = async (req, res) => {

  try {

    const anime = await Anime.aggregate([
      { $sample: { size: 10 } }
    ]);

    res.json(anime);

  } catch (error) {
    res.status(500).json({ message: "Top anime fetch failed" });
  }

};