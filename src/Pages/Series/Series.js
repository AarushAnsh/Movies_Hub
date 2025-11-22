import React, { useState, useEffect } from "react";
import SingleContent from "../../Components/SingleContent/SingleContent";
import CustomPagination from "../../Components/Pagination/CustomPagination";
import Genres from "../../Components/Genres/Genres";
import useGenres from "../../Hooks/UseGenre";

const Series = () => {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);

  const API_KEY = "dc5e54f47e1adf658c0fca36e5332e8e";
  const genreURL = useGenres(selectedGenres);

  const fetchSeries = async () => {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=${page}&with_genres=${genreURL}`;

    const res = await fetch(url);
    const data = await res.json();
    setContent(data.results);
    const totalPages = Math.min(data.total_pages || 1, 500);
    setNumOfPages(totalPages);

    if (page > totalPages) {
      setPage(totalPages);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, [page, genreURL]);

  return (
    <div>
      <div className="pageHero pageHero--left">
        <p className="pageTitle">TV Series</p>
      </div>

      <Genres
        type="tv"
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
        setPage={setPage}
      />

      <div className="trending">
        {content &&
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.name}
              date={c.first_air_date}
              media_type="tv"
              vote_average={c.vote_average}
            />
          ))}
      </div>

      {numOfPages > 1 && (
        <CustomPagination
          page={page}
          setPage={setPage}
          numOfPages={numOfPages}
        />
      )}
    </div>
  );
};

export default Series;
