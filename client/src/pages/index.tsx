import SwiperArrow from "@/components/Buttons/SwiperNavigation";
import { ProductCard } from "@/components/Cards/Product";
import CheckoutMethod from "@/components/Checkout/CheckoutMethod";
import { default as LazyImage } from "@/components/Images/LazyFadeImage";
import CollectionsCarousel from "@/components/PageSections/Mainpage/Collections";
import Slides from "@/components/PageSections/Mainpage/Slides/Slides";
import { ASSET_URL } from "@/constants/URLS";
import { useCartStore } from "@/hooks/storeSlices/CartSlice";
import { axiosClient as axiosClientJson } from "@/libraries/axiosConfig";
import { devLog } from "@/utils/log";
import { appendDomain, cn } from "@/utils/stringUtils";
import {
  Category2 as Category,
  Collection,
  PaymentMethod,
  Slide,
} from "@/utils/types/entityTypes";
import { Col, Row } from "antd";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/bundle";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import styles from "./index.module.css";
import NextImage from "next/image";

type Product = Parameters<typeof ProductCard>[0]["product"];

export async function getStaticProps() {
  try {
    const urls = [
      `/features`,
      `/slides?active=true`,
      `/categories?topMonth=true&limit=20&active=true&isDeleted=false`,
      `/products?topMonth=true&limit=20&isDeleted=false`,
      `/products?hotDeal=true&limit=20`,
      `/products?active=true&limit=8&fromDiscount=3`,
      `/collections?limit=8`,
    ];

    const errors: unknown[] = [];
    const promiseResults = (
      await Promise.allSettled(
        urls.map((url) => axiosClientJson.get<{ results: unknown[] }>(url))
      )
    ).map((result, i) => {
      if (result.status === "fulfilled") {
        return result.value.data.results;
      } else {
        errors[i] = true;
        return [];
      }
    });
    const [
      paymentMethods,
      slides,
      hotCategories,
      topMonth,
      hotDeal,
      productView,
      collections,
    ] = promiseResults;
    return {
      props: {
        paymentMethods,
        slides,
        hotCategories,
        topMonth,
        hotDeal,
        productView,
        collections,
      },
      revalidate: 24 * 60 * 60,
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

interface HomePageProps {
  topMonth: Product[];
  hotCategories: Category[];
  hotDeal: Product[];
  slides: Slide[];
  productView: Product[];
  paymentMethods: PaymentMethod[];
  collections: Collection[];
}

function ProductCardSwiper({
  products,
  cardProps,
  swiperProps,
  classPrefix,
}: {
  products: Product[];
  cardProps: Partial<Parameters<typeof ProductCard>[0]>;
  swiperProps: Partial<Parameters<typeof Swiper>[0]>;
  classPrefix: string;
}) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const len = products.length;

  return (
    <div className="mb-8 mx-auto">
      <div className="relative bg-transparent rounded-xl">
        <Swiper
          speed={500}
          slidesPerView={5}
          navigation={{
            prevEl: `.prev_${classPrefix}`,
            nextEl: `.next_${classPrefix}`,
          }}
          className={`mySwiper w-full mx-auto`}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 8,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 8,
            },
          }}
          modules={[Pagination, Navigation, Autoplay]}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          {...swiperProps}
        >
          {products?.length > 0 &&
            products?.map((item) => (
              <SwiperSlide
                key={`product-${item._id}`}
                className="flex justify-center"
              >
                <div className="aspect-[2/3] sm:aspect-[3/4] xl:aspect-[2/3]">
                  <ProductCard
                    product={item}
                    variant="vertical"
                    {...cardProps}
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
        <SwiperArrow
          type="prev"
          className={`prev_${classPrefix}`}
        />
        <SwiperArrow
          type="next"
          className={`next_${classPrefix}`}
        />
      </div>
    </div>
  );
}

function HotdealSection({ hotDeal }: { hotDeal: Product[] }) {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="mb-8 mx-auto">
      <div className="relative bg-transparent rounded-xl">
        <Swiper
          speed={500}
          slidesPerView={5}
          navigation={{
            prevEl: ".prev_hot_deal",
            nextEl: ".next_hot_deal",
          }}
          className={`mySwiper w-full`}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 8,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 8,
            },
          }}
          modules={[Pagination, Navigation, Autoplay]}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {hotDeal?.length > 0 &&
            hotDeal?.map((item) => (
              <SwiperSlide
                key={`product-${item._id}`}
                className="flex justify-center"
              >
                <ProductCard
                  product={item}
                  variant="vertical"
                />
              </SwiperSlide>
            ))}
        </Swiper>
        <SwiperArrow
          type="prev"
          className="prev_hot_deal"
        />
        <SwiperArrow
          type="next"
          className="next_hot_deal"
        />
      </div>
    </div>
  );
}

function TopMonthSection({ topMonth = [] }: { topMonth: Product[] }) {
  const swiperRef = useRef<SwiperClass | null>(null);
  return (
    <div
      id="top_month"
      className="mb-6 mx-auto rounded-xl shadow-md relative"
    >
      <Swiper
        loop={true}
        effect={"coverflow"}
        grabCursor={true}
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        speed={500}
        navigation={{
          prevEl: ".prev_top_month",
          nextEl: ".next_top_month",
        }}
        autoplay={{ delay: 3000, disableOnInteraction: true }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            // centeredSlides: true,
          },
          768: {
            slidesPerView: 2,
            // centeredSlides: true,
          },
          1024: {
            slidesPerView: 3,
            // centeredSlides: true,
          },
          1280: {
            slidesPerView: 4,
            // centeredSlides: false,
          },
        }}
        className="bg-none w-full"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {topMonth.map((product) => (
          <SwiperSlide key={`slide-of-${product._id}`}>
            <ProductCard
              product={product}
              variant="vertical"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <SwiperArrow
        type="prev"
        className="prev_top_month"
      />
      <SwiperArrow
        type="next"
        className="next_top_month"
      />
    </div>
  );
}

function PopularCategories({
  categories,
}: {
  categories: (Category & { products: Product[] })[];
}) {
  const [idx, setIdx] = useState(0);
  const currentCat = categories[idx];
  return (
    <div className="bg-white">
      <div className={cn("mt-[4rem] py-[4rem]", styles.ctn)}>
        <h2 className="text-center text-2xl md:text-3xl font-bold text-amber-900">
          Dòng hàng nổi bật
        </h2>
        <div className={cn("flex flex-col lg:flex-row gap-3 items-center")}>
          <div>
            <NextImage
              src={currentCat.coverImageUrl}
              width={200}
              height={400}
              loading="lazy"
              style={{ objectFit: "cover" }}
              alt="Ảnh dòng hàng"
              className={cn("aspect-square lg:aspect-[3/4] w-80 lg:w-96")}
            />
          </div>
          <div>
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, idx) => {
                const { _id } = category;
                return (
                  <button
                    key={`category-${category._id}`}
                    className={cn(
                      "inline-block p-3 mb-2 border-2 border-transparent rounded-md bg-blue-50",
                      currentCat._id === _id && "border-blue-400 bg-blue-200",
                      "can-hover:cursor-pointer can-hover:hover:bg-blue-200",
                      "transition-colors"
                    )}
                    onClick={() => {
                      setIdx(idx);
                    }}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
            {/* Selecting Category description */}
            <p className="mt-5">
              <i>{currentCat.description}</i>
            </p>
          </div>
        </div>
      </div>
      <div className={cn(styles.popularCategories, "relative")}>
        <NextImage
          className="relative left-[50%] translate-x-[-50%] top-[90px] sm:mb-14"
          width={90}
          height={40}
          src="/arrow-down.svg"
          alt="arrow-down"
        />
        <div className={cn("py-[4rem] min-h-[20rem]", styles.ctn)}>
          <div className="mt-[3rem]">
            <ProductCardSwiper
              cardProps={{
                className: "bg-white h-full w-full",
                variant: "horizontal",
              }}
              classPrefix="popCat"
              products={currentCat.products}
              swiperProps={{}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage(props: HomePageProps) {
  const {
    topMonth,
    hotCategories,
    hotDeal,
    slides,
    productView,
    paymentMethods,
    collections,
  } = props;

  // const { searchCategory } = useProdsSearch((state) => state);
  return (
    <>
      <Head>
        <title>Jewelry Shop</title>
        <meta
          name="description"
          content="Generated by create next app"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8857116005396641"
          crossOrigin="anonymous"
        />
      </Head>
      <section className="w-full bg-gray-50">
        {/* Carousel Section */}
        <Slides slides={slides} />

        {/* Pthuc thanh toan */}
        <div className="overflow-hidden mt-8">
          <div className={styles.ctn}>
            <div
              style={{ backgroundColor: "rgba(255, 250, 240, 0.95)" }}
              className="rounded-xl shadow-sm border border-amber-100 p-6 md:p-8"
            >
              <h3 className="text-center text-lg md:text-xl font-semibold text-gray-800 mb-6">
                Phương thức thanh toán
              </h3>
              <CheckoutMethod dataMethod={paymentMethods} />
            </div>

            <div className="mt-12">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-center text-2xl md:text-3xl font-bold text-gray-800 grow">
                  Bạn đang tìm gì hôm nay?
                </h3>
                {/* <div className="flex-1 h-1 bg-gradient-to-r from-amber-400 to-transparent rounded-full"></div> */}
              </div>

              <div className="w-full grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6 mx-auto">
                {hotCategories?.map((item, index) => (
                  <div
                    key={`${item._id}-${index + 1}-${item.name}`}
                    onClick={() => {
                      router.push(`${item.slug}`);
                    }}
                    className="text-center cursor-pointer shrink-0 group transition-all duration-300"
                  >
                    <div
                      className={`flex flex-1 items-center justify-center overflow-hidden  relative ${styles.group} rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                    >
                      <LazyImage
                        alt={item.name}
                        src={appendDomain(
                          `${item.imageUrl}?v=${Date.now()}`,
                          ASSET_URL
                        )}
                        style={{
                          transition: "0.5s",
                          width: "100%",
                          aspectRatio: "1 / 1",
                        }}
                        className="object-fill rounded-lg"
                        // rootClassName="rounded-lg overflow-hidden"
                      />
                      <div
                        className={`absolute top-0 -left-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 ${styles["group-hover:animate-shine"]}`}
                      ></div>
                    </div>
                    <h6
                      style={{ height: 40 }}
                      className="text-center p-2 text-nowrap text-ellipsis overflow-hidden text-sm font-medium text-gray-700 mt-2"
                    >
                      {item.name}
                    </h6>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hot trong thang */}
        <div className="py-12 md:py-16 mt-12">
          <div className={styles.ctn}>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                Hot trong tháng
              </h3>
              <div className="flex-1 h-1 bg-gradient-to-r from-amber-400 to-transparent rounded-full"></div>
            </div>
            <TopMonthSection topMonth={topMonth} />
          </div>
        </div>

        <PopularCategories
          categories={props.hotCategories.map((cat) => ({
            ...cat,
            products: cat.products || [],
          }))}
        />

        {/* Bộ sưu tập */}
        <div className="bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 py-12 md:py-16 mt-12]">
          <div className={styles.ctn}>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-900">
                Bộ sưu tập
              </h2>
              <p className="text-amber-700 mt-2 text-sm md:text-base">
                Khám phá những bộ sưu tập độc đáo từ chúng tôi
              </p>
            </div>
            <CollectionsCarousel collections={collections} />
          </div>
        </div>

        {/* Ưu đãi */}
        <div className="mt-12">
          <div className={styles.ctn}>
            <div className="flex items-center gap-4 mb-8">
              <h3
                className="text-2xl md:text-3xl font-bold text-gray-800"
                id="hot_deal"
              >
                <Link href="#hot_deal">Ưu đãi hấp dẫn</Link>
              </h3>
              <div className="flex-1 h-1 bg-gradient-to-r from-red-400 to-transparent rounded-full"></div>
            </div>
            <HotdealSection hotDeal={hotDeal} />
          </div>
        </div>

        {/* Xem them */}
        <div className="bg-gradient-to-r from-red-200 via-orange-50 to-red-200 mt-12">
          <div className={styles.ctn}>
            <div className="flex items-center gap-4 mb-8 pt-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                Xem thêm
              </h3>
              <div className="flex-1 h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full"></div>
            </div>

            <div className="mx-auto py-6">
              <div className="text-center flex justify-center items-center">
                <Row
                  gutter={[
                    { xs: 8, sm: 8, md: 12, xl: 12 },
                    { xs: 8, sm: 8, md: 12, xl: 12 },
                  ]}
                  className="p-0 w-full"
                >
                  {(productView || [])?.map((product) => {
                    return (
                      <Col
                        key={`${product._id}`}
                        xs={24}
                        lg={12}
                        xl={6}
                      >
                        <ProductCard
                          product={product}
                          classNames={{
                            image: "w-full h-[180px] md:h-[200px]",
                          }}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </div>
          </div>
        </div>
        {/* <FacebookMsg /> */}
      </section>
    </>
  );
}
