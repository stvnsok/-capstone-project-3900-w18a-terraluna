import React from "react";
import Box form "@mui/material/Box";

export default function SearchResult (ingredient) {

  return (
    <Box
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      // onClick={() => { setSearch(ingredient) }}
    >
      <div className="ml-3">
        <div>{ingredient.name}</div>
      </div>
    </Box>
  );
}