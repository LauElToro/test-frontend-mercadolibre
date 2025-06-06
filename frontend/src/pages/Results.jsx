import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchItems } from "../utils/api";
import ProductCard from "../components/ProductCard";
import "../styles/results.scss";

const ITEMS_PER_PAGE = 3;

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

  return (
    <div className="results-page">
      <h2>Resultados para: "{query}"</h2>

      <div className="results-grid">
        {paginatedProducts.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Results;
