import React from "react";
import { Helmet } from "react-helmet-async";
import SearchBox from "../components/SearchBox";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Inicio | Tu Marca</title>
        <meta name="description" content="Buscá y encontrá miles de productos en un solo lugar. Envíos gratis y cuotas sin interés." />
        <meta property="og:title" content="Inicio | Tu Marca" />
        <meta property="og:description" content="Explorá los productos más buscados. Encontrá lo que necesitás al mejor precio." />
      </Helmet>

      <main className="home-page" role="main">
      </main>
    </>
  );
};

export default Home;
