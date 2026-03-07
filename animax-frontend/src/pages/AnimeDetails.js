import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../App.css";

function AnimeDetails() {

  const { id } = useParams();
  const [anime, setAnime] = useState(null);

  useEffect(() => {

    const fetchAnime = async () => {

      const res = await axios.get(
        `http://localhost:3001/api/anime/${id}`
      );

      setAnime(res.data);

    };

    fetchAnime();

  }, [id]);

  if (!anime) return <h2 style={{textAlign:"center"}}>Loading...</h2>;

  return (

    <div>

      {/* HERO BANNER */}
      <div
        className="hero"
        style={{
          backgroundImage:`url(${anime.poster})`
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

    </div>

  );

}

export default AnimeDetails;