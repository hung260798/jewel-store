import React from "react";
import styles from "./style.module.css";

interface ImagePlaceholderProps {
  className?: string;
  text?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  className = "",
  text = "Hình ảnh không khả dụng",
}) => {
  return (
    <div className={`${styles.placeholderContainer} ${className}`}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.iconWrapper}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
          <circle
            cx="12"
            cy="12"
            r="10"
            strokeOpacity="0.1"
          />
        </svg>
      </div>
      <p className={styles.placeholderText}>{text}</p>
    </div>
  );
};

export default ImagePlaceholder;
