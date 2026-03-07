import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

function Home() {

  const [anime, setAnime] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [trending, setTrending] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [featured, setFeatured] = useState(null);

  const loader = useRef(null);
  const trendingRef = useRef(null);
  const topRef = useRef(null);


  /* FEATURED ANIME */

  useEffect(() => {

    axios
      .get("http://localhost:3001/api/anime")
      .then(res => {

        if(res.data.length > 0){

          const randomAnime =
            res.data[Math.floor(Math.random() * res.data.length)];

          setFeatured(randomAnime);

        }

      })
      .catch(err => console.log(err));

  }, []);


  /* TRENDING */

  useEffect(() => {

    axios
      .get("http://localhost:3001/api/anime/trending")
      .then(res => setTrending(res.data))
      .catch(err => console.log(err));

  }, []);


  /* TOP ANIME */

  useEffect(() => {

    axios
      .get("http://localhost:3001/api/anime/top")
      .then(res => setTopAnime(res.data))
      .catch(err => console.log(err));

  }, []);


  /* LOAD ANIME */

  useEffect(() => {

    const fetchAnime = async () => {

      try {

        const res = await axios.get(
          `http://localhost:3001/api/anime?page=${page}`
        );

        if (res.data.length === 0) {
          setHasMore(false);
        } else {
          setAnime(prev => [...prev, ...res.data]);
        }

      } catch (error) {
        console.log("Error fetching anime");
      }

    };

    if (search === "") {
      fetchAnime();
    }

  }, [page, search]);


  /* INFINITE SCROLL */

  useEffect(() => {

    const observer = new IntersectionObserver(
      entries => {

        if (entries[0].isIntersecting && hasMore && search === "") {
          setPage(prev => prev + 1);
        }

      },
      { threshold: 1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

  }, [hasMore, search]);


  /* SEARCH */

  const handleSearch = async (e) => {

    const value = e.target.value;
    setSearch(value);

    if (value.length === 0) {
      setAnime([]);
      setPage(1);
      setHasMore(true);
      return;
    }

    try {

      const res = await axios.get(
        `http://localhost:3001/api/anime/search?q=${value}`
      );

      setAnime(res.data);

    } catch (error) {
      console.log("Search error");
    }

  };


  return (

    <div className="container">

      <h1>--Animaxx--</h1>


      {/* HERO */}

      {featured && (

        <div className="hero">

          <img
            className="hero-bg"
            src={featured.poster}
            alt={featured.title}
          />

          <div className="hero-overlay">

            <h1>{featured.title}</h1>

            <p>
              {featured.description?.slice(0,150)}...
            </p>

            <Link
              to={`/anime/${featured._id}`}
              className="back-btn"
            >
              ▶ View Details
            </Link>

          </div>

        </div>

      )}


      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search anime..."
        value={search}
        onChange={handleSearch}
        className="search"
      />


      {/* TRENDING */}

      {search === "" && trending.length > 0 && (

        <>
          <h2 className="section-title">🔥 Trending Anime</h2>

          <div className="row-wrapper">

            <button
              className="scroll-btn left"
              onClick={() =>
                trendingRef.current.scrollBy({
                  left: -400,
                  behavior: "smooth"
                })
              }
            >
              ◀
            </button>

            <div className="row" ref={trendingRef}>

              {trending.map(a => (

                <Link
                  to={`/anime/${a._id}`}
                  className="row-card"
                  key={a._id}
                >

                  <img
                    draggable="false"
                    src={a.poster}
                    alt={a.title}
                  />

                  <h3>{a.title}</h3>

                </Link>

              ))}

            </div>

            <button
              className="scroll-btn right"
              onClick={() =>
                trendingRef.current.scrollBy({
                  left: 400,
                  behavior: "smooth"
                })
              }
            >
              ▶
            </button>

          </div>
        </>

      )}


      {/* TOP RATED */}

      {search === "" && topAnime.length > 0 && (

        <>
          <h2 className="section-title">⭐ Top Rated Anime</h2>

          <div className="row-wrapper">

            <button
              className="scroll-btn left"
              onClick={() =>
                topRef.current.scrollBy({
                  left: -400,
                  behavior: "smooth"
                })
              }
            >
              ◀
            </button>

            <div className="row" ref={topRef}>

              {topAnime.map(a => (

                <Link
                  to={`/anime/${a._id}`}
                  className="row-card"
                  key={a._id}
                >

                  <img
                    draggable="false"
                    src={a.poster}
                    alt={a.title}
                  />

                  <h3>{a.title}</h3>

                </Link>

              ))}

            </div>

            <button
              className="scroll-btn right"
              onClick={() =>
                topRef.current.scrollBy({
                  left: 400,
                  behavior: "smooth"
                })
              }
            >
              ▶
            </button>

          </div>
        </>

      )}


      {/* ALL ANIME GRID */}

      <h2 className="section-title">All Anime</h2>

      <div className="grid">

        {anime.map(a => (

          <Link
            to={`/anime/${a._id}`}
            className="card"
            key={a._id}
          >

            <div className="poster-wrapper">

              <img
                src={a.poster}
                alt={a.title}
              />

              {a.trailer && (
                <div className="play-overlay">
                  ▶ Trailer
                </div>
              )}

            </div>

            <h3>{a.title}</h3>

            <p><b>Episodes:</b> {a.episodes}</p>
            <p><b>Genre:</b> {a.genre}</p>

          </Link>

        ))}

      </div>


      {search === "" && (
        hasMore ? (
          <div ref={loader} className="loading">
            Loading more anime...
          </div>
        ) : (
          <div className="loading">
            No more anime
          </div>
        )
      )}

    </div>

  );

}

export default Home;