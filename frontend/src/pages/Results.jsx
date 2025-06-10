import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchItems } from "../utils/api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/pagination";
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

  return (
    <>
      <Helmet>
        <title>Resultados para "{query}" | Tu Marca</title>
        <meta name="description" content={`Encontrá los mejores resultados para "${query}". Ofertas, envíos gratis y cuotas sin interés.`} />
        <meta property="og:title" content={`Resultados para "${query}"`} />
        <meta property="og:description" content={`Productos disponibles para "${query}".`} />
      </Helmet>

      <main className="results-page" role="main">
        <div className="results-list">
          {paginatedProducts.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </main>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Results;
