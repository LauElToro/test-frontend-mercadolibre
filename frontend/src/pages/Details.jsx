import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchItemDetail } from "../utils/api";
import MobileCarousel from "../components/MobileCarousel";
import PhotoModal from "../components/PhotoModal";
import "../styles/Details.scss";

const Details = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [lensPos, setLensPos] = useState({ top: 0, left: 0 });
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const imgRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const openModalAt = (index) => {
    setModalIndex(index);
    setPhotoModalOpen(true);
  };

  if (!item) return <div className="text-center py-5">Cargando detalle...</div>;

  const visibleThumbnails = 7;
  const extraCount = item.pictures.length - visibleThumbnails;

  return (
    <div className="details-page">
      <div className="details-page__breadcrumbs">
        <Link to="/" className="breadcrumbs-link">Volver al listado</Link>
        <div className="breadcrumbs-path">
          {item.category_path_from_root?.join(" > ")}
        </div>
      </div>

      {isMobile && item && (
        <div className="details-page__mobile-header">
          <div className="condition">{item.condition === "new" ? "Nuevo" : "Usado"} | +{item.sold_quantity}</div>
          <h1 className="title">{item.title}</h1>
        </div>
      )}

      <div className="details-page__gallery">
        {!isMobile && (
          <div className="details-page__thumbnails">
            {item.pictures.slice(0, visibleThumbnails).map((pic, index) => (
              <img
                key={pic}
                src={pic}
                alt={item.title}
                className={`details-page__thumb ${pic === activeImage ? "active" : ""}`}
                onMouseEnter={() => setActiveImage(pic)}
                onClick={() => openModalAt(index)}
              />
            ))}
            {extraCount > 0 && item.pictures[visibleThumbnails] && (
              <div
                className="details-page__thumb extra"
                onClick={() => openModalAt(visibleThumbnails)}
              >
                <img src={item.pictures[visibleThumbnails]} alt="extra" />
                <div className="extra-overlay">+{extraCount}</div>
              </div>
            )}
          </div>
        )}

        {isMobile && (
          <MobileCarousel
            pictures={item.pictures}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            onImageClick={(index) => openModalAt(index)}
          />
        )}

        {!isMobile && (
          <div
            className="details-page__main-image"
            onClick={() => openModalAt(item.pictures.indexOf(activeImage))}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
            ref={imgRef}
          >
            <img src={activeImage} alt={item.title} />
            {showZoom && (
              <div
                className="zoom-lens"
                style={{ top: lensPos.top, left: lensPos.left }}
              />
            )}
          </div>
        )}

        {!isMobile && showZoom && (
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
        <div className="info-header">
          <div className="condition">
            {item.condition === "new" ? "Nuevo" : "Usado"} | {item.sold_quantity > 100 ? "+100" : item.sold_quantity} vendidos
          </div>
          <div className="title-wrapper">
            <h1 className="title">{item.title}</h1>
          </div>
        </div>
        {item.seller?.name && <div className="seller">Por {item.seller.name}</div>}
        <div className="price">${item.price.amount.toLocaleString("es-AR")}</div>
        {item.installments && (
          <div className="installments">
            Cuota promocionada en {item.installments.quantity} cuotas de <br />
            ${item.installments.amount.toLocaleString("es-AR")}
          </div>
        )}
        {item.price.regular_amount && (
          <div className="regular-price">
            Precio sin impuestos nacionales: ${item.price.regular_amount.toLocaleString("es-AR")}
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

      {isPhotoModalOpen && (
        <PhotoModal
          pictures={item.pictures}
          startIndex={modalIndex}
          onClose={() => setPhotoModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Details;
