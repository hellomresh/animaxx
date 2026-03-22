const express = require("express");
const router = express.Router();

const {
  getAnime,
  addAnime,
  getAnimeById,
  deleteAnime,
  fetchAnimeFromAPI,
  importAnime,
  searchAnime,
  getTrendingAnime,
  getTopAnime,
  getRecommendations
} = require("../controllers/animeController");

router.get("/", getAnime);
router.post("/", addAnime);

router.get("/external", fetchAnimeFromAPI);
router.get("/import", importAnime);
router.get("/trending", getTrendingAnime);
router.get("/top", getTopAnime);
router.get("/search", searchAnime);
router.get("/recommend/:id", getRecommendations);

router.get("/:id", getAnimeById);
router.delete("/:id", deleteAnime);

module.exports = router;