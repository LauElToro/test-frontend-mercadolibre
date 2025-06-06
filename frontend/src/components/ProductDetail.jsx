import React from "react";

const ProductDetail = ({ product }) => {
  if (!product) return <p>No hay datos del producto</p>;

  return (
    <div className="product-detail">
      <h2>{product.title}</h2>
      <img src={product.pictures?.[0]} alt={product.title} />
      <p>{product.description}</p>
      <ul>
        {product.attributes?.map(attr => (
          <li key={attr.id}><strong>{attr.name}</strong>: {attr.value_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDetail;
