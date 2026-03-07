import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function AnimeDetailsLive() {

  const { id } = useParams();
  const [anime, setAnime] = useState(null);

  useEffect(() => {

    axios
      .get(`https://api.jikan.moe/v4/anime/${id}`)
      .then(res => setAnime(res.data.data))
      .catch(err => console.log(err));

  }, [id]);

  if (!anime) return <p>Loading...</p>;

  return (

    <div className="details-container">

      <div className="details-poster">
        <img src={anime.images.jpg.image_url} alt={anime.title}/>
      </div>

      <div className="details-info">

        <h1>{anime.title}</h1>

        <p><b>Episodes:</b> {anime.episodes}</p>

        <p><b>Score:</b> {anime.score}</p>

        <p className="description">{anime.synopsis}</p>

        <Link to="/" className="back-btn">
          ← Back
        </Link>

      </div>

    </div>

  );

}

export default AnimeDetailsLive;