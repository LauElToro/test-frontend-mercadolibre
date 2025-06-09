import React from "react";
import "../styles/pages.scss";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const maxPages = 10;
    const start = 1;
    const end = Math.min(maxPages, totalPages);
    const pages = [];

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination__item${i === currentPage ? ' pagination__item--active' : ''}`}
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
            Siguiente{">"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
