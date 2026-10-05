import { Image } from "antd";
import { useState } from "react";
import style from "./style.module.css";
import { ImageProps } from "antd/es/image";
import { cn } from "@/utils/stringUtils";

export type PropTypes = ImageProps & { domain?: string };

const LazyFadeImage: React.FC<PropTypes> = ({
  className,
  fallback,
  domain = "",
  src,
  ...props
}: PropTypes) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      alt="Ảnh"
      loading="lazy"
      preview={false}
      className={cn(
        loaded ? style.fadeIn : style.hidden,
        style.fallbackTransition,
        className
      )}
      onLoad={() => setLoaded(true)}
      fallback={fallback || "/placeholder_ring.png"}
      src={`${domain}${src}`}
      {...props}
    />
  );
};

export default LazyFadeImage;
