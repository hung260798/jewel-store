import React from "react";
import style from "./BarLoading.module.css"; // Import file CSS

interface LoadingBarProps {
  isVisible: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ isVisible }) => {
  return (
    <div
      className={`${style.loadingOverlay} ${isVisible ? "" : style.fadeOut}`}>
      <div className={`${style.loadingContainer}`}>
        <div className={`${style.bar} ${style.bar1}`}></div>
        <div className={`${style.bar} ${style.bar2}`}></div>
        <div className={`${style.bar} ${style.bar3}`}></div>
      </div>
    </div>
  );
};

export default LoadingBar;
