/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, HashNavigation, Autoplay } from "swiper";
import SafeImage from "@/components/Images/SafeImage";
import { Slide } from "@/utils/types/entityTypes";
import { appendDomain } from "@/utils/stringUtils";
import router from "next/router";
import { ASSET_URL } from "@/constants/URLS";

// const imageRatio = 3.08;

const Slides = ({ slides }: { slides: Slide[] }) => {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="w-full">
      <div className="flex py-4 gap-0 px-0">
        <div className="flex-auto w-full relative">
          <Swiper
            loop={false}
            pagination={true}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation, HashNavigation]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            initialSlide={0}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={1}
            className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg"
          >
            {slides.length > 0 &&
              slides.map((item, index) => (
                <SwiperSlide
                  key={`${item._id}-${index + 1}`}
                  onClick={() => {
                    router.push(`${item.url}`);
                  }}
                  className="cursor-pointer"
                >
                  <SafeImage
                    width={1200}
                    height={600}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    style={{
                      transition: "0.5s",
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLImageElement>) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLImageElement>) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    alt={item?.summary ?? ""}
                    src={appendDomain(item.imageUrl || "", ASSET_URL)}
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                    priority={index === 0}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Slides;
