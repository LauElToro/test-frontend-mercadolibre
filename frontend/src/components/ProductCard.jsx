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

  const isReconditioned =
    condition === "reconditioned" || condition === "refurbished";

  const currentPrice = price?.amount || 0;
  let regularPrice = price?.regular_amount;

  let cuotas = 0;
  if (typeof installments === "string") {
    const match = installments.match(/^(\d+)/);
    cuotas = match ? parseInt(match[1], 10) : 0;
  }

  const precioCuota = cuotas > 0 ? currentPrice / cuotas : 0;
  const totalCuotas = precioCuota * cuotas;
  const esPrecioIgual = Math.abs(totalCuotas - currentPrice) < 1;

  const inferredRegularPrice =
    !regularPrice && !esPrecioIgual && totalCuotas > currentPrice
      ? Math.round(totalCuotas)
      : null;

  const effectiveRegularPrice =
    typeof regularPrice === "number"
      ? regularPrice
      : inferredRegularPrice;

  const hasDiscount =
    typeof effectiveRegularPrice === "number" &&
    effectiveRegularPrice > currentPrice;

  const discountPercent = hasDiscount
    ? Math.round(((effectiveRegularPrice - currentPrice) / effectiveRegularPrice) * 100)
    : 0;

  const formatCurrency = (val) =>
    `$${val.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

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
          {hasDiscount ? (
            <>
              <div className="product-card__price-regular">
                {formatCurrency(effectiveRegularPrice)}
              </div>
              <div className="product-card__price-current">
                {formatCurrency(currentPrice)}
                <span className="product-card__discount">
                  {" "}{discountPercent}% OFF
                </span>
              </div>
            </>
          ) : (
            <div className="product-card__price-current">
              {formatCurrency(currentPrice)}
            </div>
          )}
        </div>

        {cuotas > 0 && (
          <div className="product-card__installments">
            {esPrecioIgual
              ? `Mismo precio en ${cuotas} cuotas de ${formatCurrency(precioCuota)}`
              : `${cuotas} cuotas de ${formatCurrency(precioCuota)}`}
          </div>
        )}

        {free_shipping && (
          <div className="product-card__shipping">Envío gratis</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
