import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchItemDetail } from "../utils/api";
import "../styles/details.scss";

const Details = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetchItemDetail(id)
      .then((data) => setItem(data.item))
      .catch(console.error);
  }, [id]);

  if (!item) return <div className="loading">Cargando detalle...</div>;

  return (
    <div className="details-container">
      <div className="details-main">
        <div className="details-image">
          <img src={item.pictures?.[0]} alt={item.title} />
        </div>

        <div className="details-info">
          <p className="condition">
            {item.condition === "new" ? "Nuevo" : "Usado"} · {item.sold_quantity} vendidos
          </p>

          {item.category_path_from_root?.length > 0 && (
            <p className="breadcrumbs">
              {item.category_path_from_root.join(" > ")}
            </p>
          )}

          <h1 className="title">{item.title}</h1>

          <p className="price">${item.price.amount.toLocaleString("es-AR")}</p>

          {item.price.regular_amount && (
            <p className="regular-price">
              Antes: ${item.price.regular_amount.toLocaleString("es-AR")}
            </p>
          )}

          {item.installments && item.installments.quantity && item.installments.amount ? (
            <p className="installments">
              {item.installments.quantity} cuotas de ${item.installments.amount.toLocaleString("es-AR")}
            </p>
          ) : null}

          <button className="buy-button">Comprar</button>
        </div>
      </div>

      <div className="details-description">
        <h2>Descripción del producto</h2>
        <p>
          {item.description && item.description.length > 10
            ? item.description
            : "No se encontró descripción para este producto."}
        </p>
      </div>

      {item.attributes?.length > 0 && (
        <div className="details-attributes">
          <h2>Características</h2>
          <ul>
            {item.attributes.map((attr) => (
              <li key={attr.id}>
                <strong>{attr.name}:</strong> {attr.value_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Details;
