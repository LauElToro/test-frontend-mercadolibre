import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchItems } from "../utils/api";
import ProductCard from "../components/ProductCard";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container my-4">
      <h2 className="mb-4 text-dark">Resultados para: “{query}”</h2>

      <div className="row gy-4">
        {paginatedProducts.map(item => (
          <div key={item.id} className="col-12">
            <ProductCard item={item} />
          </div>
        ))}
      </div>

      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(page - 1)}
            >
              Anterior
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Página {page} de {totalPages}
            </span>
          </li>
          <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(page + 1)}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Results;
