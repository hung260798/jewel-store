import ErrorComponent from "@/components/Placeholders/Errors";
import { useCartStore } from "@/hooks/storeSlices/CartSlice";
import { axiosClient } from "@/libraries/axiosConfig";
import { devLog, printError } from "@/utils/log";
import { Product } from "@/utils/types";
import { GetMany } from "@/utils/types/entityTypes";
import { Button, Form, Input, Rate, message } from "antd";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import { MouseEvent } from "react";
import { ASSET_URL } from "@/constants/URLS";
import { appendDomain } from "@/utils/stringUtils";
import React, { useState } from "react";
import { FreeMode, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { LazyFadeImage } from "@/components/Images";

interface Props {
  product: Product | null;
  error: unknown;
}

const ProductDetailPage = (props: Props) => {
  const { product, error } = props;
  const { data: session } = useSession();
  const user = session?.user;
  const add = useCartStore((state) => state.add);
  const itemsInCart = useCartStore((state) => state.items);
  const increase = useCartStore((state) => state.increase);
  const removeAllCheckoutItems = useCartStore((state) => state.removeAllCheck);
  const addToCheckout = useCartStore((state) => state.addCheck);
  const [commentForm] = Form.useForm();
  if (error || !product) {
    return (
      // <div className="flex justify-center items-center min-h-[20rem]">
      <ErrorComponent statusCode={500} />
      // </div>
    );
  }
  const handlePostComent = async (record: {
    comment: string;
    rateNumber: number;
  }) => {
    const customer = {
      imageUrl: user?.imageUrl,
      customerId: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      comment: record.comment,
    };
    const response = await axiosClient.get(`/products/${product._id}`);
    const updateData = response.data.result;
    if (response.data.result.rateInfo) {
      updateData.rateInfo.push({
        customer: customer,
        rateNumber: record.rateNumber,
        createdAt: new Date(),
      });
    } else {
      updateData.rateInfo = [];
      updateData.rateInfo.push({
        customer: customer,
        rateNumber: record.rateNumber,
        createdAt: new Date(),
      });
    }
    axiosClient
      .patch(`/products/${product._id}`, {
        rateInfo: updateData.rateInfo,
      })
      .then(() => {
        commentForm.resetFields();
        message.success({
          content: "Cảm ơn quý khách đã đánh giá sản phẩm của chúng tôi",
          // style: { marginTop: 170 },
          duration: 1.5,
        });
      })
      .catch((err) => {
        devLog(err);
      });
  };
  const loremIpsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const handleAddToCart = () => {
    if (!user) {
      router.push("/dang-nhap");
      message.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!!", 1.5);
    } else {
      const productId = product._id;
      const productExists = itemsInCart.some(
        (item) => item.product._id === productId
      );
      if (productExists === true) {
        increase(productId);
        message.success(
          {
            content: "Thêm 1 sản phẩm vào giỏ hàng!",
          },
          1.5
        );
      } else {
        add({ product: product, quantity: 1 });
        message.success(
          {
            content: "Đã thêm sản phẩm vào giỏ hàng!",
          },
          1.5
        );
      }
    }
  };
  const handleAddToCartClick: (e: MouseEvent) => void = () => {
    handleAddToCart();
  };
  const handleCheckout: (e: MouseEvent) => void = () => {
    if (!user) {
      router.push("/dang-nhap");
      message.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!!", 1.5);
    } else {
      removeAllCheckoutItems();
      addToCheckout({ product: product, quantity: 1 });
      router.push("/checkout");
    }
  };
  const { name, averageRate, price, discount, stock, description } = product;

  const discountPrice =
    Math.round(((1 - discount / 100) * price) / 1000) * 1000;

  // devLog("product :>> ", product);
  return (
    <main className="bg-gray-50 min-h-screen">
      <Head>
        <title>{`${product.name ?? ""} | Jewelry Shop`}</title>
      </Head>

      <section className="max-w-7xl mx-auto px-2 md:px-0">
        {/** Product images and text */}
        <section className="py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 lg:items-start">
            {/* Product Images */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full bg-white rounded-2xl shadow-lg p-4 lg:p-6 sticky top-20">
                <ImagesOfProduct
                  images={[...(product.images || [])]}
                  swiperWidth={480}
                  breakpoint={"md"}
                />
              </div>
            </div>

            {/* Product Details */}
            <section
              className="w-full"
              id="product-details"
            >
              <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-8 space-y-6">
                {/* Badge */}
                <div>
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">
                    ✨ Sản phẩm nổi bật
                  </span>
                </div>

                {/* Product Name */}
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                    {name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-4 mb-4">
                    <Rate
                      disabled={true}
                      value={averageRate}
                      style={{ fontSize: 16 }}
                    />
                    <span className="text-sm text-gray-600">
                      ({averageRate} sao)
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">
                      {stock > 0 ? "Còn" : "Hết"} hàng
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="border-t pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
                    <div className="text-4xl font-bold text-amber-600 break-all">
                      {discountPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </div>
                    {discountPrice !== price && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <span className="text-xl text-gray-400 line-through break-all">
                          {price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                        <span className="inline-block px-2 py-1 text-sm font-bold text-white bg-red-500 rounded">
                          -{Math.round(discount)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Mô tả sản phẩm:
                  </h3>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t space-y-3">
                  <button
                    onClick={handleAddToCartClick}
                    type="button"
                    className="w-full px-6 py-3 bg-white border-2 border-amber-600 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300 hover:shadow-lg"
                  >
                    🛒 Thêm vào giỏ hàng
                  </button>
                  <button
                    onClick={handleCheckout}
                    type="button"
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:shadow-xl active:scale-95"
                  >
                    ⚡ Mua ngay
                  </button>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Giao hàng</p>
                    <p className="text-sm font-semibold text-gray-900">
                      Toàn quốc
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Bảo hành</p>
                    <p className="text-sm font-semibold text-gray-900">
                      Có hỗ trợ
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/** Related products */}
        <section className="py-8 sm:px-6 lg:px-8 lg:py-12">
          <h2 className="ml-2 text-2xl lg:text-3xl font-bold">
            Sản phẩm tương tự
          </h2>
        </section>

        {/* Product Description Section */}
        <section className="sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 lg:px-8 py-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                📋 Chi tiết sản phẩm
              </h2>
            </div>

            {/* Section Content */}
            <div className="px-4 lg:px-8 py-8 prose prose-sm max-w-none">
              <div className="text-gray-700 leading-relaxed">
                {description ? (
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                ) : (
                  <p className="text-gray-500 italic">{loremIpsum}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/** Review section */}
        <section className="sm:px-6 lg:px-8 py-12 mb-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 lg:px-8 py-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                ⭐ Đánh giá & Bình luận
              </h2>
              <p className="text-blue-100 mt-2">
                Chia sẻ trải nghiệm của bạn với sản phẩm này
              </p>
            </div>

            {/* Form Section */}
            <div className="p-4 md:p-6 lg:p-8">
              {user ? (
                <Form
                  form={commentForm}
                  name="commentForm"
                  labelAlign="left"
                  onFinish={handlePostComent}
                  autoComplete="off"
                  layout="vertical"
                  className="space-y-6"
                >
                  <div className="bg-blue-50 p-2 md:p-4 rounded-lg border border-blue-200">
                    <Form.Item
                      label={
                        <span className="font-semibold text-gray-900">
                          Đánh giá của bạn
                        </span>
                      }
                      name="rateNumber"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn mức đánh giá!",
                        },
                      ]}
                    >
                      <Rate
                        character="⭐"
                        allowHalf
                      />
                    </Form.Item>
                  </div>

                  <div className="bg-gray-50 p-2 md:p-4 rounded-lg border border-gray-200">
                    <Form.Item
                      label={
                        <span className="font-semibold text-gray-900">
                          Bình luận của bạn
                        </span>
                      }
                      name="comment"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập bình luận!",
                        },
                        {
                          min: 10,
                          message: "Bình luận phải có ít nhất 10 ký tự!",
                        },
                      ]}
                    >
                      <Input.TextArea
                        showCount
                        maxLength={600}
                        rows={6}
                        placeholder="Hãy chia sẻ trải nghiệm của bạn với sản phẩm này..."
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <Button
                      htmlType="submit"
                      type="primary"
                      size="large"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white font-semibold"
                    >
                      ✈️ Gửi đánh giá
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    Vui lòng đăng nhập để gửi đánh giá
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => router.push("/dang-nhap")}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 border-0"
                  >
                    🔐 Đăng nhập ngay
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

const BreakPoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

function ImagesOfProduct(props: {
  images: string[];
  swiperWidth?: number;
  breakpoint?: keyof typeof BreakPoints;
}) {
  let { images } = props;
  const { swiperWidth: initWidth = 400 } = props;
  const [currentIdx, setCurrentIdx] = useState(0);
  // const windowWidth = useWindowWidth();
  if (!images || images.length == 0) {
    images = ["/placeholder-image.jpg"];
  } else {
    images = images.map((src) => appendDomain(src, ASSET_URL));
  }
  const gap = 10;
  // const imgWidth = 100;
  // const swiperWidth =
  //   windowWidth >= BreakPoints[breakpoint] ? initWidth : windowWidth;
  // const noOfSlides = swiperWidth / (imgWidth + gap);

  return (
    <div className="flex flex-col items-start gap-2">
      {/**Main image */}
      <div className="relative w-full overflow-hidden mx-auto">
        <div className="bg-[#f7f7f7] rounded-lg overflow-hidden flex justify-center items-center">
          <LazyFadeImage
            style={
              { "--dynamic-width": `${initWidth}px` } as React.CSSProperties
            }
            className={`object-contain max-h-[30rem] aspect-square mx-auto select-none`}
            rootClassName="w-full"
            src={`${images[currentIdx]}`}
            alt={`Ảnh sản phẩm`}
            preview={{ maskClassName: "hidden lg:flex" }}
          />
        </div>
      </div>
      {/**List Images */}
      <div className="relative w-full">
        <Swiper
          style={
            {
              "--dynamic-width": `${initWidth}px`,
            } as React.CSSProperties
          }
          className={`w-full h-[100px] select-none`}
          spaceBetween={gap}
          slidesPerView={"auto"}
          navigation
          modules={[FreeMode, Navigation]}
        >
          {images?.map((imageSrc, index) => {
            return (
              <SwiperSlide
                className={`!w-[100px] !h-[100px] flex-shrink-0 ${
                  currentIdx === index
                    ? "border-blue-500 shadow-md"
                    : "border-gray-300"
                } border-2 overflow-hidden rounded-lg transition-all duration-200`}
                key={`${index}_${imageSrc}`}
              >
                <LazyFadeImage
                  className={`cursor-pointer object-cover w-full h-full rounded-md dark:border-gray-700 bg-[#f7f7f7] hover:scale-110 transition-transform duration-300`}
                  src={`${imageSrc}`}
                  alt="A product image"
                  width={100}
                  height={100}
                  preview={false}
                  onClick={() => setCurrentIdx(index)}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

const limit = 100;

export default ProductDetailPage;

export const getStaticPaths = (async () => {
  try {
    const results = await axiosClient.get<GetMany<Product>>(
      `/products?active=true&isDeleted=false&skip=0&limit=${limit}`
    );
    const products = results.data.results;
    const paths = products.map((product: Product) => ({
      params: { id: product.slug || product._id || "not-found" },
    }));
    return { paths, fallback: false };
  } catch (error) {
    devLog(error);
    return { paths: [], fallback: false };
  }
}) satisfies GetStaticPaths;

// This also gets called at build time
export const getStaticProps = (async ({ params }) => {
  try {
    const response = await axiosClient.get(`/products/slug/${params?.id}`);
    const product = response.data.result;
    return { props: { product: product, error: null } };
  } catch (error) {
    devLog(error);
    return {
      props: {
        product: null,
        error: printError(error),
      },
    };
  }
}) satisfies GetStaticProps<Props>;
