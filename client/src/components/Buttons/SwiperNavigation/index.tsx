import React from "react";
import clsx from "clsx";

export default function SwiperArrow({
  onClick,
  type = "prev",
  className,
}: {
  onClick?: () => void;
  type: "prev" | "next";
  className?: string;
}) {
  const isPrev = type === "prev";
  return (
    <div
      onClick={onClick}
      className={clsx(
        "cursor-pointer select-none w-[32px] h-[32px] flex items-center justify-center bg-[#eeeff3] hover:text-red-400 rounded-full z-10 absolute top-[50%] translate-y-[-40%]",
        {
          "left-0 translate-x-[-45%]": isPrev,
          "right-0 translate-x-[45%]": !isPrev,
        },
        className
      )}>
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon={`chevron-${isPrev ? "left" : "right"}`}
        className={`svg-inline--fa fa-chevron-${
          isPrev ? "left" : "right"
        } w-[10px]`}
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512">
        <path
          fill="currentColor"
          d={
            isPrev
              ? "M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
              : "M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
          }
        />
      </svg>
    </div>
  );
}
