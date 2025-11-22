import { Chip } from '@mui/material';
import React, { useEffect } from 'react';
import { API_KEY } from '../../config';

const Genres = ({
  selectedGenres,
  setSelectedGenres,
  genres,
  setGenres,
  type,
  setPage,
}) => {

  const fetchGenres = async () => {
    const url = `https://api.themoviedb.org/3/genre/${type}/list?api_key=${API_KEY}&language=en-US`;

    try {
      const response = await fetch(url, {
        cache: 'force-cache', // Genres don't change often, cache aggressively
      });
      const data = await response.json();

      setGenres(data.genres || []);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    fetchGenres();

    return () => {
      setGenres([]);
    };
    // eslint-disable-next-line
  }, []);

  // ✔️ ADD GENRE → selectedGenres me bhejo
  const handleAdd = (genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    setGenres(genres.filter((g) => g.id !== genre.id));
    setPage(1);
  };

  // ✔️ REMOVE GENRE → wapas genres me bhejo
  const handleRemove = (genre) => {
    setSelectedGenres(selectedGenres.filter((g) => g.id !== genre.id));
    setGenres([...genres, genre]);
    setPage(1);
  };

  const baseChipStyles = {
    margin: "6px 8px 0 0",
    borderRadius: "999px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: "0.7rem",
    fontWeight: 700,
  };

  return (
    <div style={{ padding: "6px 0", marginBottom: "20px" }}>

      {/* SELECTED GENRES (Top) */}
      {selectedGenres.map((genre) => (
        <Chip
          key={genre.id}
          label={genre.name}
          size="medium"
          sx={{
            ...baseChipStyles,
            px: 2.4,
            py: 0.4,
            background: "linear-gradient(120deg, #f77062, #fe5196)",
            color: "#ffffff",
            boxShadow: "0 12px 24px rgba(247,112,98,0.35)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
          onDelete={() => handleRemove(genre)}   // ✔️ correct
        />
      ))}

      {/* AVAILABLE GENRES (Bottom) */}
      {genres.map((genre) => (
        <Chip
          key={genre.id}
          label={genre.name}
          clickable
          variant="outlined"
          sx={{
            ...baseChipStyles,
            px: 2.1,
            borderColor: "rgba(5, 8, 20, 0.12)",
            color: "#0b0f1f",
            backgroundColor: "#ffffff",
            boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
            "&:hover": {
              background: "linear-gradient(120deg, #ff5f6d, #ffc371)",
              color: "#ffffff",
              borderColor: "#ff5f6d",
              boxShadow: "0 10px 22px rgba(0,0,0,0.25)",
            },
          }}
          onClick={() => handleAdd(genre)}       // ✔️ correct
        />
      ))}

    </div>
  );
};

export default Genres;
