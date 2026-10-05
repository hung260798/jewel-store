import { useCartStore } from "@/hooks/storeSlices/CartSlice";
import { useSaveOrderId } from "@/hooks/storeSlices/SaveOrderIdSlice";
import useAxiosAuth from "@/libraries/axiosAuth";
import { axiosAuth } from "@/libraries/axiosConfig";
import { catchErr } from "@/utils/log";
import { devLog, printError } from "@/utils/log";
import { PaymentMethod } from "@/utils/types/entityTypes";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Grid,
  Input,
  Radio,
  Row,
  Select,
  Space,
  message,
} from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CheckoutPay from "@/components/PageSections/CheckoutPay";
import { phoneRegex } from "@/utils/validate/utilSchemas";

interface NameId {
  Id: number;
  Name: string;
}

interface City extends NameId {
  Districts: District[];
}

interface District extends NameId {
  Wards: Ward[];
}

type Ward = NameId;

type Payment = "shipCod" | "momo" | "vnpay";

const { Option } = Select;

type PageProps = {
  dataMethod: PaymentMethod[];
  error?: string;
};

const { useBreakpoint } = Grid;

const CheckoutPage = (props: PageProps) => {
  const screens = useBreakpoint();
  const { dataMethod } = props;
  const router = useRouter();
  useAxiosAuth();
  const { data: session } = useSession();
  const user = session?.user;
  const { saveOrderId } = useSaveOrderId((state) => state);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [payMethod, setPayMethod] = useState<Payment>("shipCod");
  const [position, setPosition] = useState<{
    regionName: unknown;
    lat: unknown;
    lon: unknown;
  }>();

  const itemsCheckout = useCartStore((state) => state.itemsCheckout);
  const remove = useCartStore((state) => state.remove);

  //Lấy danh sách tỉnh thành
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setCities(response.data);
      } catch (error) {
        devLog(error);
      }
    };

    fetchData();
  }, []);

  //Lấy vị trí
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://ip-api.com/json");
        setPosition(response.data);
      } catch (error) {
        devLog(error);
      }
    };

    fetchData();
  }, []);

  const renderCity = () => {
    return cities.map((city) => (
      <Option
        key={city.Id}
        value={city.Id}
      >
        {city.Name}
      </Option>
    ));
  };

  const renderDistrict = () => {
    return districts.map((district) => (
      <Option
        key={district.Id}
        value={district.Id}
      >
        {district.Name}
      </Option>
    ));
  };

  const renderWard = () => {
    return wards.map((ward) => (
      <Option
        key={ward.Id}
        value={ward.Id}
      >
        {ward.Name}
      </Option>
    ));
  };

  const handleCityChange = (cityId: number) => {
    const selectedCity = cities.find((city) => city.Id === cityId);
    setDistricts(selectedCity?.Districts || []);
    setWards([]);
  };

  const handleDistrictChange = (districtId: number) => {
    const selectedDistrict = districts.find(
      (district) => district.Id === districtId
    );
    setDistricts((prevDistricts) => {
      const updatedDistricts = prevDistricts.map((district) => {
        if (district.Id === districtId) {
          return {
            ...district,
            selected: true,
          };
        } else {
          return {
            ...district,
            selected: false,
          };
        }
      });
      return updatedDistricts;
    });
    setWards(selectedDistrict?.Wards || []);
  };

  const handlePaySubmit = catchErr(
    async (values: {
      firstName: unknown;
      lastName: unknown;
      description: string;
      phoneNumber: unknown;
      address: string;
      city: number;
      district: number;
      ward: number;
    }) => {
      const selectedCity = cities.find((city) => city.Id === values.city);
      const selectedDistrict = districts.find(
        (district) => district.Id === values.district
      );
      const selectedWard = wards.find((ward) => ward.Id === values.ward);
      const cityName = selectedCity?.Name;
      const districtName = selectedDistrict?.Name;
      const wardName = selectedWard?.Name;
      const shippingAddress = `${values.address}, ${wardName}, ${districtName}, ${cityName}`;

      const orderData: Record<string, string | object | null> = {};
      orderData.createdDate = new Date().toISOString();
      orderData.shippedDate = new Date().toISOString();
      orderData.description = values.description;
      orderData.shippingAddress = shippingAddress;
      orderData.status = "WAITING";
      orderData.orderDetails = itemsCheckout.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));
      orderData.contactInformation = {
        address: orderData.shippingAddress,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      };
      orderData.customerId = `${user?._id}`;
      orderData.position = position
        ? {
            name: position.regionName,
            lat: position.lat,
            lng: position.lon,
          }
        : null;

      let paymentType: string = "CASH";
      switch (payMethod) {
        case "shipCod":
          break;
        case "momo":
          paymentType = "MOMO";
          break;
        case "vnpay":
          paymentType = "VNPAY";
          break;
      }
      orderData.paymentType = paymentType;
      const {
        data: { result, oke },
      } = await axiosAuth.post<{
        result: { _id: string };
        oke: boolean;
      }>(`/orders`, orderData);
      // if (oke) {
      //   const {
      //     data: { message },
      //   } = await axiosAuth.post<{ message: string }>(
      //     `/products/orderp/${result._id}/stock`
      //   );
      //   devLog(message);
      // }

      if (payMethod === "shipCod") {
        saveOrderId(result._id);
        router.push("success-payment");
      } else if (payMethod === "momo" || payMethod === "vnpay") {
        const amount = itemsCheckout
          .map((item) => item.product.price * item.quantity)
          .reduce((accumulator, subtotal) => accumulator + subtotal, 0);
        try {
          const response = await axiosAuth.post(
            `/orders/pay/create_${payMethod}_url`,
            {
              amount: amount,
            }
          );
          window.location.href = response.data.urlPay;
        } catch (error) {
          devLog("««««« error »»»»»", error);
          if (payMethod === "momo") {
            await axiosAuth.delete(`/orders/${result?._id}`);
            message.error({
              content:
                "Momo chỉ cho phép thanh toán giá trị đơn hàng dưới 10 triệu đồng!!, vui lòng thay đổi cách thanh toán.",
              style: {
                marginTop: 130,
              },
            });
          }
        }
      }
      itemsCheckout.forEach((item) => {
        const productId = item.product._id;
        remove(productId);
      });
    },
    (err) => {
      message.error(printError(err), 1);
      devLog(err);
    }
  );

  const onFinishFailed = (errorInfo: unknown) => {
    devLog("Failed:", errorInfo);
  };

  return (
    <div
    // className={`bg-[linear-gradient(90deg,rgba(42,123,155,1)_0%,_rgba(87,199,133,1)_50%,rgba(237,221,83,1)_100%)]`}
    >
      {/* <div style={{ background: "rgb(245,245,245)" }}>
        <div className={`container`}>
          <h4 className={`text-center py-4`}>
            {user?._id
              ? `Thủ tục thanh toán`
              : `Vui lòng đăng nhập để truy cập thanh toán!`}
          </h4>
          <Divider orientation="left"> Phương thức thanh toán cho phép</Divider>
        </div>

        <CheckoutMethod dataMethod={dataMethod} />
      </div> */}

      {user?._id ? (
        <div className="max-w-full w-full xl:w-[1120px] mx-auto mt-2 overflow-hidden">
          {/* <div className={`lg:container mx-auto `}> */}
          <div className={`flex flex-col xl:flex-row`}>
            <div className={`pl-2 pr-1 py-2 w-auto xl:w-1/2`}>
              {" "}
              <Card
                className={`border border-dark-subtle`}
                title={
                  <div className={`w-full text-center md:text-start`}>
                    Thông tin thanh toán
                  </div>
                }
                style={{ width: "100%" }}
              >
                <div className={`hidden md:flex justify-between border-bottom`}>
                  <strong>Sản phẩm</strong>
                  <strong>Tạm tính</strong>
                </div>
                {/* {renderOrders()} */}

                <CheckoutPay />
                <Divider></Divider>

                <Radio.Group
                  defaultValue={payMethod}
                  onChange={(e) => setPayMethod(e?.target?.value)}
                >
                  <Space
                    direction="vertical"
                    size={"middle"}
                  >
                    <Radio
                      className={`border-bottom`}
                      value="shipCod"
                    >
                      <Space>
                        <span>Shipcod</span>
                        <span>
                          <Image
                            width={25}
                            height={25}
                            src={
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKbZ0bQHF9cNGzFlD8gAddwu0a15l43bcWyg&usqp=CAU"
                            }
                            alt={""}
                            className="w-[25px] h-[25px]"
                          />
                        </span>
                      </Space>
                    </Radio>
                    <Radio
                      className={`border-bottom`}
                      value="momo"
                    >
                      <Space>
                        <span>Momo</span>
                        <span>
                          <Image
                            width={25}
                            height={25}
                            src={
                              "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png?20201011055544"
                            }
                            alt={""}
                            className="w-[25px] h-[25px]"
                          />
                        </span>
                      </Space>
                    </Radio>
                    <Radio
                      className={`border-bottom`}
                      value="vnpay"
                    >
                      <Space>
                        <span>Vnpay</span>
                        <span>
                          <Image
                            width={25}
                            height={25}
                            src={
                              "https://vivnpay.vn/assets/landing/bat-nhip-tet/0701/29.png"
                            }
                            alt={""}
                            className="w-[25px] h-[25px]"
                          />
                        </span>
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Card>
            </div>

            <div className={`py-2 pr-2 pl-1 w-auto xl:w-1/2`}>
              <Card
                className={`border border-dark-subtle`}
                title={
                  <div className={`w-full text-center md:text-start`}>
                    Đơn hàng của bạn
                  </div>
                }
                style={{ width: "100%" }}
              >
                <Form
                  layout="vertical"
                  name="payForm"
                  onFinish={handlePaySubmit}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Row gutter={{ md: 10 }}>
                    <Col
                      xs={24}
                      md={12}
                    >
                      <Form.Item
                        label="Họ"
                        name="firstName"
                        rules={[
                          {
                            required: true,
                            message: "Please input your First Name!",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      md={12}
                    >
                      <Form.Item
                        label="Tên"
                        name="lastName"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Last Name!",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      { type: "email" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Điện thoại"
                    name="phoneNumber"
                    rules={[
                      { required: true, message: "Số điện thoại là bắt buộc" },
                      {
                        pattern: phoneRegex,
                        message: "Số điên thoại không hợp lệ",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Tỉnh Thành"
                    name="city"
                    rules={[
                      { required: true, message: "Please select your city!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn tỉnh thành"
                      onChange={(cityId) => {
                        handleCityChange(cityId);
                      }}
                    >
                      {renderCity()}
                    </Select>
                  </Form.Item>
                  <Row gutter={{ md: 10 }}>
                    <Col
                      xs={24}
                      md={12}
                    >
                      <Form.Item
                        label="Quận/ Huyện"
                        name="district"
                        rules={[
                          {
                            required: true,
                            message: "Please select your district!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Chọn quận huyện"
                          onChange={handleDistrictChange}
                        >
                          {renderDistrict()}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      md={12}
                    >
                      <Form.Item
                        label="Phường/ Xã"
                        name="ward"
                        rules={[
                          {
                            required: true,
                            message: "Please select your ward!",
                          },
                        ]}
                      >
                        <Select placeholder="Chọn phường xã">
                          {renderWard()}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[
                      { required: true, message: "Please input your address!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Ghi chú"
                    name="description"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{ offset: 0 }}
                    className="flex justify-end"
                  >
                    <Button
                      className={`border-gray-200 dark:bg-gray-900 hover:text-gray-400 mr-3`}
                      htmlType="submit"
                      type="primary"
                    >
                      Thanh toán
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <Divider>Vui lòng đăng nhập!!</Divider>
      )}
    </div>
  );
};

export default CheckoutPage;

export async function getStaticProps() {
  try {
    // Payment methods
    // dataMethod.data { results, amountResults }
    const dataMethod = await axiosAuth.get(`/features`);
    return {
      props: {
        dataMethod: dataMethod.data.results,
      },
      revalidate: 24 * 60 * 60,
    };
  } catch (error) {
    devLog(error);
    return {
      props: {
        dataMethod: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      notFound: true,
    };
  }
}
