import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./Components/Header/Header"
import MainNav from "./Components/MainNav";

import { Container } from "@mui/material";

import Trending from "./Pages/Trending/Trending";
import Search from "./Pages/Search/Search";
import Movie from "./Pages/Movies/Movie";
import Series from "./Pages/Series/Series";

const App = () => (
  <BrowserRouter>
    <Header />

    <div className="app">
      <Container>
        <Routes>
          <Route path="/" element={<Trending />} />
          <Route path="/movies" element={<Movie />} />
          <Route path="/series" element={<Series />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Container>
    </div>

    <MainNav />
  </BrowserRouter>
  
);

export default App;
