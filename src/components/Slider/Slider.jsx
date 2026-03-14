import React, { useState, useEffect } from "react";
import "./Slider.css";
import slide1 from "../../assets/slides/1.jpg";
import slide2 from "../../assets/slides/2.jpg";
import slide3 from "../../assets/slides/3.jpg";
import slide4 from "../../assets/slides/4.jpg";
import slide5 from "../../assets/slides/5.jpg";
import slide6 from "../../assets/slides/6.jpg";
import slide7 from "../../assets/slides/7.png";
import slide8 from "../../assets/slides/8.png";
import slide9 from "../../assets/slides/9.png";
import slide10 from "../../assets/slides/10.png";
import slide11 from "../../assets/slides/11.png";
import slide12 from "../../assets/slides/12.png";
import mslide1 from "../../assets/slides/sm1.jpg";
import mslide2 from "../../assets/slides/sm2.jpg";
import mslide3 from "../../assets/slides/sm3.jpg";

const Slider = ({ handleOpenLogin }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
  const slides = [
   { image: slide10 },
  ];

  const mobileSliderImages = [
    { image: slide10 },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 650);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeSlider = isMobile ? mobileSliderImages : slides;
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlider.length);
  };

  const handlePrev = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + activeSlider.length) % activeSlider.length
    );
  };
  const loginOpen = () => {
    if (location.pathname === "/signin") {
      handleOpenLogin();
    }
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="slider-container"
      onClick={(e) => {
        e.isPropagationStopped();
        loginOpen();
      }}
    >
      <div
        className="slides-wrapper"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {activeSlider.map((slide, index) => (
          <div key={index} className="slide">
            <img src={slide.image} alt="" className="slide-image" />
          </div>
        ))}
      </div>

      <button
        className="nav-btn prev"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
      >
        &#9664;
      </button>

      <button
        className="nav-btn next"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
      >
        &#9654;
      </button>

      <div className="indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(index);
            }}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
