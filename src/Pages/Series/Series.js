import React, { useState, useEffect, useRef } from "react";
import SingleContent from "../../Components/SingleContent/SingleContent";
import CustomPagination from "../../Components/Pagination/CustomPagination";
import Genres from "../../Components/Genres/Genres";
import useGenres from "../../Hooks/UseGenre";
import { API_KEY } from '../../config';

const Series = () => {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const abortControllerRef = useRef(null);

  const genreURL = useGenres(selectedGenres);

  const fetchSeries = async () => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=${page}&with_genres=${genreURL}`;
      const res = await fetch(url, {
        signal: abortControllerRef.current.signal,
        cache: 'default',
      });
      
      if (!res.ok) throw new Error('Network response was not ok');
      
      const data = await res.json();
      setContent(data.results || []);
      const totalPages = Math.min(data.total_pages || 1, 500);
      setNumOfPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching series:", error);
        setContent([]);
      }
    } finally {
      abortControllerRef.current = null;
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
