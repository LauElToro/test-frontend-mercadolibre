import React, { useState, useEffect } from "react";
import "../styles/searchbox.scss";

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedSearch");
    if (!hasVisited) {
      setShowTooltip(true);
      localStorage.setItem("hasVisitedSearch", "true");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleCloseTooltip = () => {
    setShowTooltip(false);
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Buscar productos, marcas y más…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="search-wrapper">
        <button type="submit">
          <span className="icon-search" />
        </button>

        {showTooltip && (
          <div className="welcome-tooltip">
            <div className="tooltip-header">
              <span className="tooltip-title">Hola</span>
              <button className="tooltip-close" onClick={handleCloseTooltip}>×</button>
            </div>
            <div className="tooltip-body">
              Para realizar búsquedas, solo debes ingresar el nombre de lo que necesites. <br />
              Puede ser productos, marcas y más...
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBox;
