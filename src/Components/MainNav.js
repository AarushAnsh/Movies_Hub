import * as React from 'react';
import Box from '@mui/material/Box';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';   // <-- correct import

const getNavValueFromPath = (path) => {
  if (path.startsWith("/movies")) return 1;
  if (path.startsWith("/series")) return 2;
  if (path.startsWith("/search")) return 3;
  return 0;
};

export default function SimpleBottomNavigation() {
  const location = useLocation();
  const [value, setValue] = React.useState(() => getNavValueFromPath(window.location.pathname));

  const navigate = useNavigate();  // <-- correct hook
  const navActionStyles = {
    color: "rgba(255,255,255,0.55)",
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    minWidth: "auto",
    px: 2.2,
    transition: "color 200ms ease, transform 200ms ease",
    "& .MuiSvgIcon-root": {
      fontSize: "1.42rem",
      marginBottom: "2px",
      transition: "transform 200ms ease",
    },
    "&.Mui-selected": {
      color: "#fff",
      transform: "translateY(-2px)",
      "& .MuiSvgIcon-root": {
        transform: "scale(1.07)",
        color: "#ff5f6d",
      },
    },
  };

  useEffect(() => {
    setValue(getNavValueFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    if (value === 0) navigate("/");
    if (value === 1) navigate("/movies");
    if (value === 2) navigate("/series");
    if (value === 3) navigate("/search");
  }, [value, navigate]);

  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        zIndex: 100,
        px: { xs: 2, sm: 4 },
        pb: { xs: 2.5, sm: 3.5 },
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <BottomNavigation
        sx={{
          pointerEvents: "auto",
          position: "relative",
          background: "rgba(7, 11, 26, 0.9)",
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 30px 60px rgba(3, 6, 20, 0.75), 0 0 30px rgba(255,95,109,0.15)",
          maxWidth: 560,
          margin: "0 auto",
          backdropFilter: "blur(22px)",
          px: 1,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 1,
            borderRadius: "inherit",
            border: "1px solid rgba(255,255,255,0.05)",
            pointerEvents: "none",
          },
        }}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          sx={navActionStyles}
          label="Trending"
          icon={<WhatshotIcon />}
        />
        <BottomNavigationAction
          sx={navActionStyles}
          label="Movies"
          icon={<MovieIcon />}
        />
        <BottomNavigationAction
          sx={navActionStyles}
          label="TV Series"
          icon={<TvIcon />}
        />
        <BottomNavigationAction
          sx={navActionStyles}
          label="Search"
          icon={<SearchIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
