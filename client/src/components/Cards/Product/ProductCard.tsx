import LazyFadeImage from "@/components/Images/LazyFadeImage";
import { ASSET_URL } from "@/constants/URLS";
import { appendDomain, cn } from "@/utils/stringUtils";
import { Product } from "@/utils/types";
import { StarOutlined } from "@ant-design/icons";
import { Button, Divider, Rate } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  product: Product;
  className?: string;
  showOldPrice?: boolean;
  style?: React.CSSProperties;
  badge?: boolean;
  classNames?: Record<string, string>;
  variant?: "vertical" | "horizontal";
  hoverTransform?: boolean;
  width?: number | string;
  height?: number | string;
}

const ProductCard = (props: Props) => {
  const router = useRouter();
  const {
    product,
    showOldPrice = false,
    className = "",
    style,
    classNames = {},
    variant = "horizontal",
    hoverTransform = true,
  } = props;
  const {
    _id,
    price = 0,
    discount = 0,
    name,
    slug,
    imageUrl,
    amountSold = 0,
    averageRate = 0.0,
  } = product;
  const finalPrice = Math.round((price * (1 - discount / 100)) / 1000) * 1000;
  const sold = amountSold >= 1000 ? `1k+` : amountSold;
  const oldPriceStr = price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const finalPriceStr = finalPrice.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const productSlug = slug || _id || "not-found";
  const goToProductPage = () => {
    router.push(`/san-pham/${productSlug}`);
  };
  const horizontalJSX = (
    <div
      key={_id}
      style={{
        background: "linear-gradient(to bottom,#fff 0%,#f7f7f7 100%)",
        ...style,
      }}
      className={cn(
        `rounded-lg bg-white shadow-md w-full lg:text-sm`,
        "flex flex-col justify-between",
        className,
        hoverTransform &&
          "hover:shadow-lg hover:-translate-y-1 transition duration-200"
      )}
    >
      {/* Image */}
      <div
        onClick={goToProductPage}
        className={cn(
          "pt-[1.75rem] border-none text-center flex flex-1 justify-center items-center",
          "grow",
          classNames.imgWrapper
        )}
      >
        <LazyFadeImage
          className={cn(
            `cursor-pointer transition-all ease-in-out delay-150 duration-300 w-[160px] lg:w-[200px] xl:w-[220px] aspect-square object-cover inline-block`,
            classNames.image
            // hoverTransform &&
            //   "can-hover:hover:-translate-y-1 can-hover:hover:scale-[1.05] "
          )}
          alt={name}
          src={appendDomain(imageUrl, ASSET_URL)}
        />
      </div>
      {/* Name,price,sold */}
      <div className="px-3 py-3">
        <div className={cn(`text-center`, classNames.linkWrapper)}>
          <Link
            href={`/san-pham/${productSlug}`}
            className={cn(
              classNames.link ||
                "line-clamp-2 overflow-hidden h-[4rem] leading-8 hover:text-sky-600 transition-all"
            )}
            title={name}
          >
            {name}
          </Link>
        </div>
        <div
          className="text-center py-4"
          style={{ color: "#c48c46" }}
        >
          {showOldPrice && (
            <>
              <span
                className={cn(
                  "line-through text-gray-500 h-[2rem] overflow-auto",
                  classNames.oldPriceSpan
                )}
              >
                {oldPriceStr}
              </span>
              <br />
            </>
          )}
          <strong
            className={cn(
              classNames.finalPrice ?? "text-[1.1rem] h-[2rem] truncate"
            )}
          >
            {finalPriceStr}
          </strong>
        </div>
        <div
          className={cn(
            "flex justify-between items-center h-[1.5rem] truncate text-sm",
            classNames.footer
          )}
        >
          <div className={cn("grow-0")}>
            <StarOutlined style={{ color: "#FFC107" }} /> (
            {Math.round(averageRate) / 2})
          </div>
          <div className={cn("grow-0")}>Đã bán {sold}</div>
        </div>
      </div>
    </div>
  );

  const verticalJSX = (
    <div
      className={cn(
        "border border-gray-200 shadow-md transition-all duration-300 h-full lg:text-sm",
        hoverTransform && "hover:shadow-xl",
        className
      )}
      style={style}
    >
      {/* Image */}
      <div
        className={cn(
          "text-center flex justify-center items-center border-0 min-h-[200px]"
          // "bg-gradient-to-b from-gray-50 to-white "
        )}
      >
        {product?.imageUrl && (
          <Link
            href={`/san-pham/${productSlug}`}
            title={name}
          >
            <LazyFadeImage
              alt={product.name}
              src={appendDomain(
                product.imageUrl + `?v=${Date.now()}`,
                ASSET_URL
              )}
              // onClick={goToProductPage}
              className={cn(
                "w-[140px] md:w-[160px] aspect-square object-center cursor-pointer transform transition-transform duration-500 ease-in-out object-contain"
                // hoverTransform && "hover:scale-110"
              )}
            />
          </Link>
        )}
      </div>

      {/* name,price,rate */}
      <div
        style={{ height: 55 }}
        className="text-center font-medium text-gray-800 line-clamp-2 cursor-pointer p-3"
        onClick={goToProductPage}
        title={name}
      >
        {product.name}
      </div>
      <div
        className="text-center py-2 md:py-3 line-clamp-1"
        style={{ color: "#c48c46" }}
      >
        <strong className="text-base">{finalPriceStr}</strong>
      </div>
      <div className="text-center text-xs md:text-sm text-gray-600">
        Đã bán: {sold}
      </div>
      <div className="text-center my-2">
        <Rate
          disabled
          defaultValue={product.averageRate}
          style={{ fontSize: "12px" }}
        />
      </div>
      <Divider className="my-2">
        <Button
          className={cn(
            "bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0 font-semibold text-sm",
            hoverTransform && "hover:from-amber-700 hover:to-amber-800"
          )}
          onClick={goToProductPage}
        >
          Chi tiết
        </Button>
      </Divider>
    </div>
  );
  return variant === "horizontal" ? horizontalJSX : verticalJSX;
};

export default ProductCard;
