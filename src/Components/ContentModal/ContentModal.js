import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "92vw", sm: "80vw", md: 640, lg: 820 },
  bgcolor: "rgba(6, 12, 30, 0.95)",
  color: "white",
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 40px 80px rgba(0,0,0,0.65)",
  p: { xs: 3, sm: 4 },
  maxHeight: "92vh",
  overflowY: "auto",
  backdropFilter: "blur(18px)",
};

const API_KEY = "dc5e54f47e1adf658c0fca36e5332e8e";

export default function ContentModal({ children, media_type, id }) {
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState(null);
  const [video, setVideo] = React.useState("");
  const [cast, setCast] = React.useState([]);

  const handleOpen = () => {
    setOpen(true);
    fetchContent();
    fetchVideo();
    fetchCredits();
  };

  const handleClose = () => setOpen(false);

  const fetchContent = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${API_KEY}&language=en-US`
    );
    setContent(await res.json());
  };

  const fetchVideo = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${API_KEY}`
    );
    const data = await res.json();
    setVideo(data.results?.[0]?.key);
  };

  const fetchCredits = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=${API_KEY}`
    );
    const data = await res.json();
    setCast(data.cast);
  };

  return (
    <div>
      <div onClick={handleOpen} className="media" style={{ cursor: "pointer" }}>
        {children}
      </div>

      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open}>
          <Box sx={style}>
            {!content ? (
              <Typography>Loading...</Typography>
            ) : (
              <>
                {/* POSTER */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${content.backdrop_path}`}
                  style={{
                    width: "100%",
                    borderRadius: 20,
                    marginBottom: 18,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />

                {/* TITLE + YEAR */}
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {content.title || content.name} (
                  {content.release_date
                    ? content.release_date.substring(0, 4)
                    : content.first_air_date?.substring(0, 4)}
                  )
                </Typography>

                {/* TAGLINE */}
                <Typography sx={{ opacity: 0.8, mt: 1 }}>
                  {content.tagline}
                </Typography>

                {/* OVERVIEW */}
                <Typography sx={{ mt: 2 }}>
                  {content.overview}
                </Typography>

                {/* CAST LIST */}
                <Typography sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
                  Top Cast
                </Typography>

                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    overflowX: "auto",
                    paddingBottom: 10,
                    scrollbarWidth: "thin",
                  }}
                >
                  {cast.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        width: 80,
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={
                          c.profile_path
                            ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
                            : "https://via.placeholder.com/80x100?text=No+Image"
                        }
                        style={{
                          width: "80px",
                          height: "100px",
                          borderRadius: 6,
                          objectFit: "cover",
                        }}
                        alt=""
                      />
                      <Typography
                        sx={{ fontSize: 12, mt: 1 }}
                        noWrap
                      >
                        {c.name}
                      </Typography>
                    </div>
                  ))}
                </div>

                {/* WATCH TRAILER BUTTON */}
                {video && (
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ mt: 2, width: "100%" }}
                    onClick={() =>
                      window.open(`https://www.youtube.com/watch?v=${video}`)
                    }
                  >
                    ▶ WATCH THE TRAILER
                  </Button>
                )}
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
