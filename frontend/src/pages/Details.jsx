import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchItemDetail } from "../utils/api";
import "../styles/Details.scss";

const Details = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [lensPos, setLensPos] = useState({ top: 0, left: 0 });
  const imgRef = useRef(null);

  useEffect(() => {
    fetchItemDetail(id)
      .then(({ item }) => {
        setItem(item);
        setActiveImage(item.pictures?.[0] || "");
      })
      .catch(console.error);
  }, [id]);

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });

    const lensSize = 100;
    const offsetX = e.clientX - rect.left - lensSize / 2;
    const offsetY = e.clientY - rect.top - lensSize / 2;
    setLensPos({ top: offsetY, left: offsetX });
  };

  if (!item) return <div className="text-center py-5">Cargando detalle...</div>;

  return (
    <div className="details-page">
      <div className="details-page__breadcrumbs">
        <Link to="/" className="breadcrumbs-link">Volver al listado</Link>
        <div className="breadcrumbs-path">
          {item.category_path_from_root?.join(" > ")}
        </div>
      </div>

      <div className="details-page__gallery">
        <div className="details-page__thumbnails">
          {item.pictures.map((pic) => (
            <img
              key={pic}
              src={pic}
              alt={item.title}
              className={`details-page__thumb ${pic === activeImage ? "active" : ""}`}
              onMouseEnter={() => setActiveImage(pic)}
            />
          ))}
        </div>

        <div
          className="details-page__main-image"
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
          ref={imgRef}
        >
          <img src={activeImage} alt={item.title} />

          {showZoom && (
            <div
              className="zoom-lens"
              style={{
                top: lensPos.top,
                left: lensPos.left
              }}
            />
          )}
        </div>

        {showZoom && (
          <div
            className="zoom-preview"
            style={{
              backgroundImage: `url(${activeImage})`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`
            }}
          />
        )}
      </div>

      <div className="details-page__info">
        <div className="condition">
          {item.condition === "new" ? "Nuevo" : "Usado"} |{" "}
          {item.sold_quantity > 100 ? "+100" : item.sold_quantity} vendidos
        </div>
        <h1 className="title">{item.title}</h1>
        {item.seller?.name && <div className="seller">Por {item.seller.name}</div>}
        <div className="price">${item.price.amount.toLocaleString("es-AR")}</div>
        {item.price.regular_amount && (
          <div className="regular-price">
            ${item.price.regular_amount.toLocaleString("es-AR")}
          </div>
        )}
        {item.installments && (
          <div className="installments">
            {item.installments.rate === 0
              ? `Mismo precio en ${item.installments.quantity} cuotas de $${item.installments.amount.toLocaleString("es-AR")}`
              : `${item.installments.quantity} cuotas de $${item.installments.amount.toLocaleString("es-AR")} con ${item.installments.rate}% interés`}
          </div>
        )}
        {item.free_shipping && <div className="shipping">Envío gratis</div>}
        {item.warranty && <div className="warranty">Garantía: {item.warranty}</div>}
        {item.attributes?.some(attr => attr.id === "COLOR") && (
          <div className="color">
            Color: {item.attributes.find(attr => attr.id === "COLOR")?.value_name}
          </div>
        )}
        <button className="buy-button">Comprar</button>
      </div>

      <div className="details-page__info description">
        <h2>Descripción del producto</h2>
        <p>{item.description || "No se encontró descripción para este producto."}</p>
      </div>

      {item.attributes?.length > 0 && (
        <div className="details-page__info attributes">
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
