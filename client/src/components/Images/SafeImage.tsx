import React, { useState } from "react";
import NextImage, { ImageProps } from "next/image";
import ImagePlaceholder from "../Placeholders/ImagePlaceholder";

interface SafeImageProps extends ImageProps {
  fallbackText?: string;
  wrapperClassName?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackText,
  className,
  wrapperClassName = "",
  onError,
  ...props
}) => {
  const [error, setError] = useState(false);

  // If src is empty or error occurred, show placeholder
  if (!src || error) {
    return (
      <ImagePlaceholder
        className={wrapperClassName || className}
        text={fallbackText}
      />
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        setError(true);
        if (onError) onError(e);
      }}
      {...props}
    />
  );
};

export default SafeImage;
