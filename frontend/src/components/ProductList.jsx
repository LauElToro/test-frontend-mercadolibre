import React from "react";
import ProductCard from "./ProductCard";
import './ProductList.scss';

const ProductList = ({ items, onItemClick }) => {
  return (
    <div className="product-list">
      {items.map(item => (
        <ProductCard key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
};

export default ProductList;
