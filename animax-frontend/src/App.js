import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AnimeDetails from "./pages/AnimeDetails";
import AnimeDetailsLive from "./pages/AnimeDetailsLive";

function App() {
  return (
    <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/anime/:id" element={<AnimeDetails />} />
  <Route path="/anime-live/:id" element={<AnimeDetailsLive />} />
</Routes>
  );
}

export default App;