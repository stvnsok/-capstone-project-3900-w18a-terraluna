import React from "react";

export default function SearchResult (ingredient) {

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      // onClick={() => { setSearch(ingredient) }}
    >
      <div className="ml-3">
        <div>{ingredient.name}</div>
      </div>
    </div>
  );
}