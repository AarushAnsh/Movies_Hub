import React from "react";
import "./SingleContent.css";
import { img_300 } from "../../config";
import Badge from "@mui/material/Badge"; // <-- Correct import
import ContentModal from "../ContentModal/ContentModal";

// Rating Color Logic
const getRatingColor = (rating) => {
  if (rating >= 7) return "#21d07a";       // Green
  if (rating >= 5) return "#d2d531";       // Yellow
  return "#db2360";                        // Red
};

const SingleContent = ({
  id,
  title,
  media_type,
  poster,
  date,
  vote_average,
}) => {
  return (
    <ContentModal media_type={media_type} id={id}>
      {/* Rating Badge */}
      <Badge
        badgeContent={vote_average?.toFixed(1)}
        overlap="circular"
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: getRatingColor(vote_average),
            color: "black",
            fontWeight: "bold",
            padding: "8px",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            border: "2px solid white",
          },
        }}
      />

      <img
        className="poster"
        src={poster ? `${img_300}/${poster}` : "unavailable"}
        alt={title}
      />

      <p className="title">{title}</p>

      <span className="subTitle">
        {media_type === "tv" ? "TV Series" : "Movie"}
        <span className="subTitle">{date}</span>
      </span>
    </ContentModal>
  );
};

export default SingleContent;
