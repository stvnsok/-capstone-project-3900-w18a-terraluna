import React from "react";
import Box from "@mui/material/Box";

export default function SearchResult (ingredient) {

  return (
    <Box
        sx = {{display: 'flex', alignItems: 'center'}}
      // onClick={() => { setSearch(ingredient) }}
    >
      <div className="ml-3">
        <div>{ingredient.name}</div>
      </div>
    </Box>
  );
}