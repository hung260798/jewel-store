import React from "react";
import "./Loading.css"; // Tái sử dụng file CSS trên

const LoadingTriangle: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="triangle-loader"></div>
    </div>
  );
};

export default LoadingTriangle;
