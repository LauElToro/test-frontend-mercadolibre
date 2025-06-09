import React, { useEffect, useState } from "react";
import "../styles/Details.scss";

const PhotoModal = ({ pictures, startIndex = 0, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const next = () => {
    if (index < pictures.length - 1) setIndex(index + 1);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="photos-modal open" onClick={onClose}>
      <div className="photos-modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="nav" onClick={prev} disabled={index === 0}>
          &lsaquo;
        </button>
        <img src={pictures[index]} alt={`Imagen ${index + 1}`} />
        <button className="nav" onClick={next} disabled={index === pictures.length - 1}>
          &rsaquo;
        </button>
        <button className="close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default PhotoModal;