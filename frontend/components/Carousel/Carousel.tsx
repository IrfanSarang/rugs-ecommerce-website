"use client";

import { useEffect, useState } from "react";
import "./Carousel.css";

interface CarouselProps {
  images: string[];
  autoPlay?: boolean;
  autoPlayTime?: number;
  height?: string;
}

export default function Carousel({
  images,
  autoPlay = true,
  autoPlayTime = 3000,
  height = "400px",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(nextSlide, autoPlayTime);
    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, autoPlayTime]);

  return (
    <div className="carousel" style={{ height }}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
        >
          <img src={image} alt={`Slide ${index}`} />

          {/* BLACK OVERLAY */}
          <div className="carousel-overlay"></div>
        </div>
      ))}

      <button className="carousel-btn prev" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="carousel-btn next" onClick={nextSlide}>
        &#10095;
      </button>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
