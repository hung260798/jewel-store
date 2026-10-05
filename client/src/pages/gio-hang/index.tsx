import CartItems from "@/components/PageSections/CartItems";
import { ASSET_URL } from "@/constants/URLS";
import { useCartStore } from "@/hooks/storeSlices/CartSlice";
import { appendDomain } from "@/utils/stringUtils";
import {
  ArrowRightOutlined,
  LockOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Affix, Card, Checkbox, Dropdown, Menu, message } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export default function CartPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroIcon}>
          <ShoppingCartOutlined />
        </div>
        <div>
          <p>ĐƠN HÀNG CỦA BẠN</p>
          <h1>Giỏ hàng</h1>
          <span>
            {user?._id
              ? "Kiểm tra sản phẩm và sẵn sàng thanh toán."
              : "Đăng nhập để xem và quản lý giỏ hàng của bạn."}
          </span>
        </div>
      </div>
      {user && (
        <section className={styles.cartContent}>
          <CartItems />
          <MyAffix />
        </section>
      )}
      {!user && (
        <section className={styles.loginPrompt}>
          <div className={styles.promptIcon}>
            <LockOutlined />
          </div>
          <h2>Đăng nhập để tiếp tục</h2>
          <p>Giỏ hàng sẽ được đồng bộ để bạn có thể mua sắm thuận tiện hơn.</p>
          <Link href="/dang-nhap">
            Đăng nhập <ArrowRightOutlined />
          </Link>
        </section>
      )}
    </main>
  );
}

const MyMenu = () => {
  // const { checkedItems } = useContext(CheckedItemsContext);
  const checkedItems = useCartStore((state) => state.itemsCheckout);
  return (
    <Menu>
      {checkedItems.map((item, index: number) => {
        const { product } = item;
        const { imageUrl = "", price, name } = product;
        return (
          <Menu.Item key={index}>
            <div
              onClick={(e) => e.preventDefault()}
              className="flex "
            >
              <div className="image">
                <Image
                  src={appendDomain(imageUrl, ASSET_URL)}
                  width={100}
                  height={100}
                  alt={name}
                />
              </div>
              <div className="content">
                <div className="">
                  <span>{name}</span>
                </div>
                <div className="py-3">
                  {price?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
              </div>
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

const MyAffix = () => {
  // const itemsCheckout = useCartStore((state) => state.itemsCheckout);
  const cartItems = useCartStore((state) => state.items);
  // const selectAllCheck = useCartStore((state) => state.selectAllCheck);
  const removeAllCheck = useCartStore((state) => state.removeAllCheck);
  const addItemToCheckoutList = useCartStore((state) => state.addCheck);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const checkedItems = useCartStore((state) => state.itemsCheckout);
  const setCheckedItems = useCartStore((state) => state.setItemsCheckout);
  const router = useRouter();
  const total = checkedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const handleCheckout = () => {
    if (checkedItems.length) {
      removeAllCheck();
      checkedItems.forEach((elem) => addItemToCheckoutList(elem));
      router.push("/checkout");
    } else {
      message.error(
        {
          content: "Vui lòng chọn sản phẩm để thanh toán!",
          style: {
            marginTop: 130,
          },
        },
        1.5
      );
    }
    return;
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize(); // Set initial window width
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Affix
      offsetBottom={5}
      className={`${cartItems.length ? "visible" : "invisible"}`}
    >
      <Card
        type="inner"
        className={styles.summaryCard}
        variant="borderless"
      >
        <div className={styles.summary}>
          <div className={styles.summarySelect}>
            <Checkbox
              checked={checkedItems.length === cartItems.length}
              indeterminate={
                checkedItems.length > 0 &&
                checkedItems.length < cartItems.length
              }
              onChange={(info) => {
                if (info.target.checked) {
                  setCheckedItems?.(cartItems);
                } else {
                  setCheckedItems?.([]);
                }
                return;
              }}
            >
              Chọn tất cả
            </Checkbox>
          </div>
          <div className={styles.summaryCount}>
            <Dropdown
              trigger={windowWidth < 900 ? ["contextMenu"] : ["hover"]}
              overlayStyle={{
                zIndex: 100,
              }}
              placement="topRight"
              overlay={<MyMenu />}
            >
              <div>
                <span>Đã chọn</span>
                <strong>{checkedItems.length} sản phẩm</strong>
              </div>
            </Dropdown>
          </div>
          <div className={styles.summaryTotal}>
            <span>Tổng thanh toán</span>
            <strong>
              {total.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </strong>
          </div>
          <div className={styles.summaryActions}>
            <button
              type="button"
              className={`${styles.checkoutButton} ${
                checkedItems.length ? "" : styles.checkoutButtonDisabled
              }`}
              onClick={handleCheckout}
              disabled={checkedItems.length === 0}
            >
              Đặt hàng <ArrowRightOutlined />
            </button>
            <button
              type="button"
              className={styles.continueButton}
              onClick={() => {
                router.push("/san-pham");
              }}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </Card>
    </Affix>
  );
};
