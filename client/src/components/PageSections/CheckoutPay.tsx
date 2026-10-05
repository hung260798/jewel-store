import { LazyFadeImage } from "@/components/Images";
import { API_URL, ASSET_URL } from "@/constants/URLS";
import { useCartStore } from "@/hooks/storeSlices/CartSlice";
import { appendDomain } from "@/utils/stringUtils";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import Link from "next/link";

const CheckoutPay = () => {
  const itemsCheckout = useCartStore((state) => state.itemsCheckout);
  const addToCheckout = useCartStore((state) => state.addCheck);

  return (
    <>
      <div className="xl:max-h-[600px] xl:overflow-y-auto">
        {itemsCheckout.length > 0 &&
          itemsCheckout.map((item) => {
            return (
              <div
                key={item.product._id}
                className={`p-0`}
              >
                <div className="md:flex md:justify-between md:items-center">
                  <div className="md:flex md:items-center gap-2">
                    <Link href={`/san-pham/${item.product.slug}`}>
                      <LazyFadeImage
                        domain={API_URL}
                        src={appendDomain(
                          item.product.imageUrl || "",
                          ASSET_URL
                        )}
                        width={80}
                        height={80}
                        className="w-28 lg:w-36 h-28 lg:h-36 object-contain border rounded-md"
                      />
                    </Link>
                    <div className="flex flex-col">
                      <span>
                        <Link
                          href={`/san-pham/${item.product.slug}`}
                          className="text-lg"
                        >
                          {item.product.name}
                        </Link>
                      </span>
                      <span className="text-red-600 text-lg leading-6 flex items-center gap-2">
                        <span className="">SL: {item.quantity}</span>
                        <Button
                          icon={<PlusOutlined />}
                          size="small"
                          onClick={() => {
                            addToCheckout({
                              product: item.product,
                              quantity: 1,
                            });
                          }}
                        ></Button>
                        <Button
                          icon={<MinusOutlined />}
                          size="small"
                          onClick={() => {
                            addToCheckout({
                              product: item.product,
                              quantity: -1,
                            });
                          }}
                        ></Button>
                      </span>
                    </div>
                  </div>
                  <span className="text-lg text-orange-600">
                    {(item.product.price * item.quantity).toLocaleString(
                      "vi-VN",
                      {
                        style: "currency",
                        currency: "VND",
                      }
                    )}
                  </span>
                </div>
                <Divider
                  key={item.product._id}
                  variant="dashed"
                ></Divider>
              </div>
            );
          })}
      </div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <strong>Tổng</strong>
        <strong>
          {itemsCheckout.length > 0
            ? itemsCheckout
                .map((item) => item.product.price * item.quantity)
                .reduce((accumulator, subtotal) => accumulator + subtotal, 0)
                .toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
            : 0}
        </strong>
      </div>
    </>
  );
};

export default CheckoutPay;
