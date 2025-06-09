import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchItems } from "../utils/api";
import ProductCard from "../components/ProductCard";
import "../styles/results.scss";

const ITEMS_PER_PAGE = 4;

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";
  const page = parseInt(queryParams.get("page")) || 1;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (query) {
      fetchItems(query)
        .then(({ items }) => setProducts(items))
        .catch(console.error);
    }
  }, [query]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    queryParams.set("page", newPage);
    navigate(`/items?${queryParams.toString()}`);
  };

  const renderPageNumbers = () => {
    const maxPages = 10;
    const start = 1;
    const end = Math.min(maxPages, totalPages);
    const pages = [];

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination__item${i === page ? ' pagination__item--active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="results-page">
      <div className="results-list">
        {paginatedProducts.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>

      <div className="pagination">
        <div className="pagination__controls">
          {page > 1 && (
            <button
              className="pagination__button"
              onClick={() => handlePageChange(page - 1)}
            >
              {"<"} Anterior
            </button>
          )}

          {renderPageNumbers()}

          {page < totalPages && (
            <button
              className="pagination__button"
              onClick={() => handlePageChange(page + 1)}
            >
              Siguiente{">"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
