import React, { useState, useEffect } from "react";
import "../styles/pages.scss";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderPageNumbers = () => {
    const maxPages = isMobile ? 5 : 10;
    const pages = [];

    let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let end = start + maxPages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination__item${
            i === currentPage ? " pagination__item--active" : ""
          }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination__controls">
        {currentPage > 1 && (
          <button
            className="pagination__button"
            onClick={() => onPageChange(currentPage - 1)}
          >
            {"<"} Anterior
          </button>
        )}

        {renderPageNumbers()}

        {currentPage < totalPages && (
          <button
            className="pagination__button"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Siguiente {">"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
