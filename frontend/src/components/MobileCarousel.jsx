import React, { useEffect, useRef, useState } from "react";
import "../styles/Details.scss";

const MobileCarousel = ({ pictures = [], activeImage, setActiveImage, onImageClick }) => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = pictures.indexOf(activeImage);
    if (index >= 0) setActiveIndex(index);
  }, [activeImage, pictures]);

  const handleScroll = () => {
    const scrollLeft = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveIndex(newIndex);
    setActiveImage(pictures[newIndex]);
  };

  const scrollToIndex = (index) => {
    if (!carouselRef.current) return;
    const width = carouselRef.current.offsetWidth;
    carouselRef.current.scrollTo({ left: index * width, behavior: "smooth" });
  };

  return (
    <div className="details-page__mobile-carousel-wrapper">
      <div
        className="details-page__mobile-carousel"
        ref={carouselRef}
        onScroll={handleScroll}
      >
        {pictures.map((pic, index) => (
          <div
            key={index}
            className="details-page__mobile-slide"
            onClick={() => onImageClick?.(index)}
            style={{ flex: '0 0 100%', scrollSnapAlign: 'start' }}
          >
            <img src={pic} alt={`Producto ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="details-page__mobile-dots">
        {pictures.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === activeIndex ? "active" : ""}`}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileCarousel;