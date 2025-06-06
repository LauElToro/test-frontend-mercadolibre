import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
import "../styles/header.scss";
import logo from "../assets/logo_large_25years@2x.png"; // ✔ ruta relativa válida

const Header = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (typeof query === "string" && query.trim()) {
      navigate(`/items?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo Mercado Libre" />
        </Link>
        <SearchBox onSearch={handleSearch} />
      </div>
    </header>
  );
};

export default Header;
