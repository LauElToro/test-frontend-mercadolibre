import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Results from '../pages/Results';
import Details from '../pages/Details';
import Layout from '../components/Layout';

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Results />} />
          <Route path="/items/:id" element={<Details />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
