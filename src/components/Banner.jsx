import React from "react";
import "../styles/banner.css"

function Banner() {
  return (
    <div className="image-container">
      <div className="fade-overlay"></div>
      <div className="text-content">
        <h1 className="manrope-semi_bold">The Residents Book</h1>
        <p className="manrope-regular">Celebrating a community of ambitious individuals</p>
      </div>
    </div>
  );
}

export default Banner;
