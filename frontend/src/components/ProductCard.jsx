import React from "react";
import { Link } from "react-router-dom";
import "../styles/productcard.scss";

const ProductCard = ({ item }) => {
  if (!item || !item.id) return null;

  const {
    id,
    title,
    price,
    picture,
    condition,
    free_shipping,
    installments,
  } = item;

  return (
    <Link to={`/items/${id}`} className="product-card">
      <div className="product-card__image">
        <img src={picture} alt={title} />
      </div>
      <div className="product-card__info">
        <h3 className="product-card__title">{title}</h3>
        <p className="product-card__price">
          {price?.currency} ${price?.amount}
          {price?.regular_amount && (
            <span className="product-card__regular">
              ${price.regular_amount}
            </span>
          )}
        </p>
        {installments && (
          <p className="product-card__installments">{installments}</p>
        )}
        <p className="product-card__condition">
          Estado: {condition === "new" ? "Nuevo" : "Usado"}
        </p>
        {free_shipping && (
          <p className="product-card__shipping">🚚 Envío gratis</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
