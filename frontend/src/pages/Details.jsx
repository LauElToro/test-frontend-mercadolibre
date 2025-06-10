import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchItemDetail } from "../utils/api";
import MobileCarousel from "../components/MobileCarousel";
import PhotoModal from "../components/PhotoModal";
import { Helmet } from 'react-helmet-async';
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
  const conditionText = item.condition === "new" ? "Nuevo" : "Usado";
  const soldText = item.sold_quantity > 0 ? `${item.sold_quantity} vendidos` : "";

  const regularPrice = item.price.regular_amount;
  const currentPrice = item.price.amount;
  const showDiscount = regularPrice && regularPrice > currentPrice;
  const discountPercent = showDiscount
    ? Math.round(100 - (currentPrice / regularPrice) * 100)
    : 0;

  const showInstallments =
    item.installments &&
    typeof item.installments.amount === "number" &&
    typeof item.installments.quantity === "number";

  const cuotas = showInstallments ? item.installments.quantity : 0;
  const montoCuota = showInstallments ? item.installments.amount : 0;
  const totalCuotas = cuotas * montoCuota;
  const mismoPrecio = Math.abs(currentPrice - totalCuotas) < 1;

  return (
    <>
<Helmet>
  <title>{item.title}</title>
  <meta name="description" content={`Comprá ${item.title} al mejor precio. ${conditionText}. ${soldText}`} />

  <meta property="og:title" content={item.title} />
  <meta property="og:description" content={item.description?.slice(0, 160)} />
  <meta property="og:image" content={item.pictures?.[0]} />
  <meta property="og:type" content="product" />
  <meta property="og:url" content={window.location.href} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={item.title} />
  <meta name="twitter:description" content={item.description?.slice(0, 160)} />
  <meta name="twitter:image" content={item.pictures?.[0]} />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: item.title,
        image: item.pictures,
        description: item.description?.slice(0, 200),
        brand: item.seller?.name || "Marca genérica",
        offers: {
          "@type": "Offer",
          priceCurrency: "ARS",
          price: currentPrice,
          availability: "https://schema.org/InStock",
          itemCondition:
            item.condition === "new"
              ? "https://schema.org/NewCondition"
              : "https://schema.org/UsedCondition",
        },
      })}
    </script>
  </Helmet>
      <div className="details-page__topbar">
        <div className="breadcrumbs-wrapper">
          <Link to="/" className="breadcrumbs-link">Volver al listado</Link>
          <span className="separator">|</span>
          <div className="breadcrumbs-path">
            {item.category_path_from_root?.join(" > ")}
          </div>
        </div>
        <div className="publication-id"><p>Publicación:</p> <span>#{item.id}</span></div>
      </div>

      <div className="details-page">
        {isMobile && (
          <div className="details-page__mobile-header">
            <div className="condition">{conditionText}{soldText ? ` | ${soldText}` : ""}</div>
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
            <div className="condition"><span>{conditionText}{soldText ? ` | ${soldText}` : ""}</span></div>
            <div className="title-wrapper">
              <h1 className="title">{item.title}</h1>
              {item.seller?.name && <div className="seller">Por {item.seller.name}</div>}
            </div>
          </div>

          

          <div className="price-block">
            {showDiscount ? (
              <>
              <div className="price-regular">
                  ${regularPrice.toLocaleString("es-AR")}
                </div>
                <div className="price">
                  ${currentPrice.toLocaleString("es-AR")}{" "}
                  <span className="discount">{discountPercent}% OFF</span>
                </div>
              </>
            ) : (
              <div className="price">
                ${currentPrice.toLocaleString("es-AR")}
                <div className="price-regular">Sin descuento</div>
              </div>
            )}

            {showInstallments ? (
              <div className="installments">
                {mismoPrecio
                  ? `Mismo precio en ${cuotas} cuotas de $${montoCuota.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : `${cuotas} cuotas de $${montoCuota.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
              </div>
            ) : (
              <div className="installments">Sin cuotas</div>
            )}
          </div>

          {item.free_shipping && <div className="shipping">Envío gratis</div>}

          {item.attributes?.some(attr => attr.id === "COLOR") && (
            <div className="color">
             <p>Color:</p> <span>{item.attributes.find(attr => attr.id === "COLOR")?.value_name}</span>
            </div>
          )}
        </div>

        <div className="details-page__info description">
          <h2>Descripción</h2>
          {item.description?.split(/\n+/)
            .filter(paragraph => paragraph.trim() !== '')
            .map((paragraph, idx) => (
              <p key={idx}>{paragraph.trim()}</p>
            ))}
        </div>

        {isPhotoModalOpen && (
          <PhotoModal
            pictures={item.pictures}
            startIndex={modalIndex}
            onClose={() => setPhotoModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default Details;
