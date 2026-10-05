import SwiperArrow from "@/components/Buttons/SwiperNavigation";
import { ProductCard } from "@/components/Cards/Product";
import { ASSET_URL } from "@/constants/URLS";
import { appendDomain, cn } from "@/utils/stringUtils";
import { Collection } from "@/utils/types/entityTypes";
import { Image as AntdImage } from "antd";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import style from "./style.module.css";

const CollectionSwiper = React.memo(function CollectionSwiper({
  displayCollections,
  onSlideChange,
}: {
  displayCollections: Collection[];
  onSlideChange: Parameters<typeof Swiper>[0]["onSlideChange"];
}) {
  const swiperRef = useRef<SwiperClass | null>(null);
  return (
    <div
      className={cn(
        "bg-transparent rounded-xl pb-10",
        style.swiper,
        style.highlightActiveSlide
      )}
    >
      <div className="relative">
        <Swiper
          key={25}
          loop={true}
          effect={"coverflow"}
          grabCursor={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{
            type: "bullets",
            el: `.${style.paginationContainer}#paginationContainer1`,
          }}
          modules={[Pagination, Navigation, EffectCoverflow]}
          speed={500}
          navigation={{
            prevEl: ".prev_collection",
            nextEl: ".next_collection",
          }}
          // autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            900: {
              slidesPerView: 3,
            },
          }}
          centeredSlides
          className="bg-transparent sm:w-3/4 mx-auto"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={onSlideChange}
        >
          {displayCollections?.map((item, idx) => {
            const { _id, image = "" } = item;
            const src = appendDomain(image, ASSET_URL);
            return (
              <SwiperSlide key={`collection-${_id}`}>
                <div
                  className={cn(
                    `text-center w-auto rounded-lg overflow-hidden no_${idx} transition-all duration-300 aspect-square`
                  )}
                >
                  <AntdImage
                    preview={false}
                    className="object-cover transform transition-transform hover:scale-105 aspect-square"
                    alt={`Ảnh của bộ sưu tập ${item?.name || "không tên"}`}
                    src={src}
                    style={{
                      transition: "0.5s",
                    }}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <SwiperArrow
          type="prev"
          className="prev_collection"
        />
        <SwiperArrow
          type="next"
          className="next_collection"
        />
      </div>

      <div className="flex justify-center items-center">
        <div
          id="paginationContainer1"
          className={cn(style.paginationContainer)}
        ></div>
      </div>
    </div>
  );
});

export default function CollectionSection({
  collections,
}: {
  collections: Collection[];
}) {
  const swiperRef2 = useRef<SwiperClass | null>(null);
  const [index, setIndex] = useState(0);
  const displayCollections = useMemo(() => {
    const validCollections = collections.filter(
      (item) => item.products && item.products.length > 0
    );
    return validCollections.length > 0 ? validCollections : [];
  }, [collections]);
  const currentCollection =
    displayCollections[Math.min(index, displayCollections.length - 1)];
  const productSlideGap = 10;
  const nSlides = currentCollection.products.length ?? 1;
  const swiperWidth = nSlides * 272.5 + (nSlides - 1) * productSlideGap;

  const onSlideChange = useCallback((swiper: SwiperClass) => {
    setIndex(swiper.realIndex);
  }, []);

  return (
    <>
      <div className={cn("mb-8 mx-auto")}>
        <CollectionSwiper
          displayCollections={displayCollections}
          onSlideChange={onSlideChange}
        />

        <div
          className={cn(
            "mt-8 relative bg-transparent rounded-xl",
            style.swiper
          )}
        >
          <div className="relative mx-auto sm:max-w-[555px] xl:max-w-[1120px]">
            <Swiper
              className={cn("max-w-full overflow-visible mx-auto", "w-fit")}
              style={
                {
                  // "--real-num-slides": currentCollection.products.length ?? 1,
                  // "--slide-width": "272.5px",
                  // "--slide-gap": `${productSlideGap}px`,
                  width: `min(100%, ${swiperWidth}px)`,
                } as React.CSSProperties
              }
              key={currentCollection._id}
              loop={true}
              grabCursor={true}
              pagination={{
                type: "bullets",
                el: `.${style.paginationContainer}#paginationContainer2`,
              }}
              modules={[Autoplay, Pagination, Navigation]}
              speed={500}
              navigation={{
                prevEl: ".prev_products_in_collection",
                nextEl: ".next_products_in_collection",
              }}
              spaceBetween={productSlideGap}
              autoplay={{
                delay: 4000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: Math.min(currentCollection.products.length, 2),
                },
                1280: {
                  slidesPerView: Math.min(currentCollection.products.length, 4),
                },
              }}
              onSwiper={(swiper) => (swiperRef2.current = swiper)}
            >
              {currentCollection?.products?.slice(0, 8).map((item) => {
                const { _id } = item;
                return (
                  <SwiperSlide key={`collection-slide-of-${_id}`}>
                    <div className={cn("w-auto")}>
                      <ProductCard
                        product={item}
                        className={cn(
                          `hover:shadow-none hover:translate-y-0`,
                          `md:w-auto px-1`
                        )}
                        showOldPrice
                        classNames={{
                          // imgWrapper: "!p-0",
                          image:
                            "w-[250px] lg:w-[250px] xl:w-[250px] aspect-square hover:scale-[1.1]",
                          linkWrapper: "truncate h-10",
                          oldPriceSpan: "h-auto overflow-visible",
                          finalPrice: "h-auto",
                          footer: "h-auto",
                        }}
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <SwiperArrow
              type="prev"
              className="prev_products_in_collection"
            />
            <SwiperArrow
              type="next"
              className="next_products_in_collection"
            />
          </div>

          <div className="flex justify-center items-center">
            <div
              id="paginationContainer2"
              className={cn(style.paginationContainer)}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
