import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.scss";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();

  if (!item || !item.id) return null;

  const {
    id,
    title,
    picture,
    price,
    condition,
    free_shipping,
    installments,
    seller,
  } = item;

  const handleClick = () => {
    navigate(`/items/${id}`);
  };

  const isReconditioned = condition === "reconditioned" || condition === "refurbished";
  const hasDiscount = price?.regular_amount > price?.amount;
  const discountPercent = hasDiscount
    ? Math.round(((price.regular_amount - price.amount) / price.regular_amount) * 100)
    : 0;

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-card__image">
        <img
          src={picture}
          alt={title}
          className="product-card__img"
          loading="lazy"
        />
      </div>

      <div className="product-card__info">
        {isReconditioned && (
          <div className="product-card__condition">Reacondicionado</div>
        )}

        <h3 className="product-card__title">{title}</h3>

        {seller?.name && (
          <div className="product-card__seller">Por {seller.name}</div>
        )}

        <div className="product-card__price">
          {hasDiscount && (
            <>
              <div className="product-card__price-regular">
                ${price.regular_amount.toLocaleString("es-AR")}
              </div>
              <div className="product-card__price-current">
                ${price.amount.toLocaleString("es-AR")}
                <span className="product-card__discount"> {discountPercent}% OFF</span>
              </div>
            </>
          )}

          {!hasDiscount && (
            <div className="product-card__price-current">
              ${price.amount.toLocaleString("es-AR")}
            </div>
          )}
        </div>

        {installments && (() => {
          const cuotasMatch = installments.match(/^(\d+)/);
          const cuotas = cuotasMatch ? parseInt(cuotasMatch[1]) : null;

          if (!cuotas || cuotas <= 0) return null;

          const precioCuota = price.amount / cuotas;
          const totalCuotas = precioCuota * cuotas;
          const esPrecioIgual = Math.abs(totalCuotas - price.amount) < 1;

          return (
            <div className="product-card__installments">
              {esPrecioIgual
                ? `Mismo precio en ${cuotas} cuotas de $${precioCuota.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : `${cuotas} cuotas de $${precioCuota.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </div>
          );
        })()}

        {free_shipping && (
          <div className="product-card__shipping">Envío gratis</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
