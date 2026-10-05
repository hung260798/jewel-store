import { API_URL } from "@/constants/URLS";
import { useCartStore } from "@/hooks/storeSlices/CartSlice";
import { appendDomain } from "@/utils/stringUtils";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import NextImg from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./styles.module.css";

function CartItemImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || "/empty_product_line.png");

  return (
    <NextImg
      width={width}
      height={height}
      alt={alt}
      src={imgSrc}
      className={className}
      onError={() => {
        setImgSrc("/empty_product_line.png");
      }}
    />
  );
}

export default function CartItems() {
  const router = useRouter();
  const {
    items,
    remove,
    increase,
    decrease,
    itemsCheckout: checkedItems,
    // addCheck,
    removeCheck,
    setItemsCheckout: setCheckedItems,
  } = useCartStore((state) => state);
  if (!items.length) {
    return (
      <div className={styles.emptyCart}>
        <NextImg
          src={`/empty_product_line.png`}
          width={200}
          height={200}
          alt="Empty cart"
          className={styles.emptyImage}
        />
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Khám phá những sản phẩm phù hợp với bạn ngay hôm nay.</p>
        <button
          type="button"
          className={styles.emptyButton}
          onClick={() => {
            router.push("/san-pham");
          }}
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }
  const isAllSelected = checkedItems.length === items.length;
  const isPartiallySelected = checkedItems.length > 0 && !isAllSelected;

  return (
    <section className={styles.cartList}>
      <div className={styles.listHeading}>
        <div>
          <p className={styles.eyebrow}>GIỎ HÀNG CỦA BẠN</p>
          <h2>Danh sách sản phẩm</h2>
          <span>{items.length} sản phẩm đang chờ bạn</span>
        </div>
        <div className={styles.selectAll}>
          <Checkbox
            checked={isAllSelected}
            indeterminate={isPartiallySelected}
            onChange={(info) =>
              setCheckedItems?.(info.target.checked ? items : [])
            }
          >
            Chọn tất cả
          </Checkbox>
        </div>
      </div>

      <div className={styles.tableHeader}>
        <span></span>
        <span>Sản phẩm</span>
        <span>Đơn giá</span>
        <span>Số lượng</span>
        <span>Thành tiền</span>
        <span></span>
      </div>
      <div className={styles.items}>
        {items.map((item) => {
          const isSelected = checkedItems.some(
            (elem) => elem.product._id === item.product._id
          );
          const lineTotal = item.product.price * item.quantity;
          const updateSelection = (selected: boolean) => {
            const newItems = selected
              ? [
                  ...checkedItems.filter(
                    (elem) => elem.product._id !== item.product._id
                  ),
                  item,
                ]
              : checkedItems.filter(
                  (elem) => elem.product._id !== item.product._id
                );
            setCheckedItems(newItems);
          };
          return (
            <article
              className={`${styles.item} ${isSelected ? styles.itemSelected : ""}`}
              key={`${item.product._id}`}
            >
              <div className={styles.checkboxCell}>
                <Checkbox
                  checked={isSelected}
                  onChange={(event) => updateSelection(event.target.checked)}
                />
              </div>
              <Link
                href={`/san-pham/${item.product.slug || item.product._id}`}
                className={styles.product}
              >
                <CartItemImage
                  width={160}
                  height={160}
                  src={appendDomain(item.product.imageUrl || "", API_URL)}
                  alt={item.product.name}
                  className={styles.productImage}
                />
                <div>
                  <h3>{item.product.name}</h3>
                  <span>Xem chi tiết sản phẩm</span>
                </div>
              </Link>
              <div
                className={styles.price}
                data-label="Đơn giá"
              >
                {item.product.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
              <div
                className={styles.quantity}
                data-label="Số lượng"
              >
                <button
                  type="button"
                  aria-label="Giảm số lượng"
                  onClick={() => decrease(item.product._id)}
                >
                  <MinusOutlined />
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  aria-label="Tăng số lượng"
                  onClick={() => increase(item.product._id)}
                >
                  <PlusOutlined />
                </button>
              </div>
              <strong
                className={styles.total}
                data-label="Thành tiền"
              >
                {lineTotal.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </strong>
              <button
                type="button"
                className={styles.removeButton}
                aria-label={`Xóa ${item.product.name} khỏi giỏ hàng`}
                onClick={() => {
                  remove(item.product._id);
                  removeCheck(item);
                  updateSelection(false);
                }}
              >
                <DeleteOutlined />
                <span className={styles.removeLabel}>Xóa</span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
