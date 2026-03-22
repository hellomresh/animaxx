import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../App.css";

function AnimeDetails() {

  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {

    const fetchAnime = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/anime/${id}`
        );
        setAnime(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/anime/recommend/${id}`
        );
        setRecommendations(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnime();
    fetchRecommendations();

  }, [id]);

  if (!anime) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (

    <div>

      {/* HERO BANNER */}
      <div
        className="hero"
        style={{
          backgroundImage: `url(${anime.poster})`
        }}
      >

        <div className="hero-overlay">

          <h1>{anime.title}</h1>

          <p>
            Episodes: {anime.episodes || "Unknown"} | {anime.genre}
          </p>

        </div>

      </div>


      {/* MAIN CONTENT */}
      <div className="details-container">

        <div className="details-poster">
          <img src={anime.poster} alt={anime.title} />
        </div>

        <div className="details-info">

          <h2>Description</h2>

          <p className="description">
            {anime.description || "No description available"}
          </p>

          <Link to="/" className="back-btn">
            ← Back to Library
          </Link>

        </div>

      </div>


      {/* TRAILER */}
      {anime.trailer && (

        <div className="trailer-section">

          <h2>Trailer</h2>

          <iframe
            width="100%"
            height="450"
            src={anime.trailer?.replace("youtube.com", "youtube-nocookie.com")}
            title="Anime Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

        </div>

      )}


      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (

        <div className="recommendations-section">

          <h2>Recommended Anime</h2>

          <div className="recommendations">

            {recommendations.map((rec) => (

              <Link to={`/anime/${rec._id}`} key={rec._id}>

                <div className="anime-card">

                  {/*  Safe Image Fallback */}
                  <img 
                    src={rec.poster || "/placeholder.jpg"} 
                    alt={rec.title} 
                  />

                  <p>{rec.title}</p>

                </div>

              </Link>

            ))}

          </div>

        </div>

      )}

    </div>

  );

}

export default AnimeDetails;