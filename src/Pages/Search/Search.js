import { Button, TextField, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import React, { useState, useEffect, useRef } from "react";
import { Tabs, Tab } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SingleContent from "../../Components/SingleContent/SingleContent";
import CustomPagination from "../../Components/Pagination/CustomPagination";
import { API_KEY } from '../../config';

const Search = () => {
  const [type, setType] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const [hasSearched, setHasSearched] = useState(false);
  const abortControllerRef = useRef(null);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#fff" },
    },
  });

  // 🔍 SEARCH API CALL
  const fetchSearch = async () => {
    if (!searchText) return;

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    try {
      const url = `https://api.themoviedb.org/3/search/${
        type ? "tv" : "movie"
      }?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(searchText)}&page=${page}`;

      const res = await fetch(url, {
        signal: abortControllerRef.current.signal,
        cache: 'default',
      });
      
      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();

      setContent(data.results || []);
      const totalPages = Math.min(data.total_pages || 1, 500);
      setNumOfPages(totalPages);
      setHasSearched(true);

      if (page > totalPages) {
        setPage(totalPages);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching search:", error);
        setContent([]);
        setHasSearched(true);
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchSearch();
    }
  };

  useEffect(() => {
    fetchSearch();
    // eslint-disable-next-line
  }, [type, page]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="pageHero">
        <p className="pageTitle">Search</p>
        <p className="pageSubtitle">Look up movies or series and jump straight into details</p>
      </div>
      <div className="search">

        {/* Search Bar */}
        <div className="searchControls">
          <TextField
            className="searchBox"
            label="Search"
            variant="filled"
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              const value = e.target.value;
              setSearchText(value);
              if (!value.trim()) {
                setContent([]);
                setNumOfPages(0);
                setPage(1);
                setHasSearched(false);
              }
            }}
          />

          <Button variant="contained" style={{ marginLeft: 10 }} onClick={fetchSearch}>
            <SearchIcon />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          value={type}
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, newValue) => {
            setType(newValue);
            setPage(1);
          }}
        >
          <Tab label="Search Movies" />
          <Tab label="Search TV Shows" />
        </Tabs>

        {/* Results */}
        {hasSearched && content && content.length === 0 ? (
          <div className="noResults">No titles found for "{searchText.trim()}"</div>
        ) : (
          <div className="trending">
            {content &&
              content.map((c) => (
                <SingleContent
                  key={c.id}
                  id={c.id}
                  poster={c.poster_path}
                  title={c.title || c.name}
                  date={c.release_date || c.first_air_date}
                  media_type={type ? "tv" : "movie"}
                  vote_average={c.vote_average}
                />
              ))}
          </div>
        )}

        {/* Pagination */}
        {numOfPages > 1 && (
          <CustomPagination setPage={setPage} numOfPages={numOfPages} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Search;
