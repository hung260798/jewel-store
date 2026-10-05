import { ASSET_URL } from "@/constants/URLS";
import useAxiosAuth from "@/libraries/axiosAuth";
import { devLog } from "@/utils/log";
import { appendDomain, cn } from "@/utils/stringUtils";
import { Customer } from "@/utils/types/entityTypes";
import {
  EditOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  OrderedListOutlined,
  PhoneOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Form,
  Grid,
  Input,
  Menu,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import type { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const { Title } = Typography;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const AccountPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [keyActive, setKeyActive] = useState<string>("information");

  const screens = useBreakpoint();

  const itemsNavbar = [
    {
      key: "information",
      icon: <UserOutlined />,
      label: <span className="shrink truncate">Thông tin cá nhân</span>,
    },
    {
      key: "order",
      icon: <OrderedListOutlined />,
      label: <span className="shrink truncate">Đơn hàng của bạn</span>,
    },
  ];

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="text-center p-8 shadow-lg rounded-2xl max-w-md w-full mx-4">
          <div className="mb-6">
            <Avatar
              size={80}
              icon={<UserOutlined />}
              className="bg-gradient-to-br from-indigo-500 to-purple-500 animate-pulse"
            />
          </div>
          <Text className="text-lg text-gray-600 animate-pulse">
            Đang tải thông tin tài khoản...
          </Text>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="text-center p-8 shadow-lg rounded-2xl max-w-md w-full mx-4">
          <div className="mb-6">
            <Avatar
              size={80}
              icon={<UserOutlined />}
              className="bg-gradient-to-br from-indigo-500 to-purple-500"
            />
          </div>
          <Text className="text-lg text-gray-600">
            Vui lòng đăng nhập để xem thông tin tài khoản
          </Text>
          <div className="mt-6">
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 border-0"
            >
              Đăng nhập ngay
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 lg:py-8 lg:px-4">
      <Card
        className="max-w-6xl min-h-[40rem] mx-auto w-full shadow-2xl rounded-2xl overflow-hidden"
        variant="borderless"
        style={{ background: "rgba(255, 255, 255, 0.95)" }}
      >
        <div className="sm:container mx-auto w-full bg-transparent flex flex-col lg:flex-row ">
          {/* Mobile sidebar */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-t-2xl -mx-4 -mt-4 mb-4 lg:hidden">
            <Menu
              mode={screens.sm ? "horizontal" : "vertical"}
              defaultSelectedKeys={["information"]}
              selectedKeys={[keyActive]}
              items={itemsNavbar.map((item) => ({
                ...item,
                style: {
                  color: "rgba(255, 255, 255, 0.9)",
                },
                className: "menu-item-custom-mobile",
              }))}
              onClick={(e) => {
                setKeyActive(e.key);
              }}
              style={{
                background: "transparent",
                borderBottom: "none",
                marginTop: "12px",
              }}
            />
            <style>{`
                .ant-menu .menu-item-custom-mobile {
                  color: rgba(255, 255, 255, 0.9) !important;
                }
                .ant-menu .menu-item-custom-mobile:hover {
                  color: white !important;
                }
                .ant-menu .menu-item-custom-mobile.ant-menu-item-selected {
                  color: white !important;
                  font-weight: 600 !important;
                }
              `}</style>
          </div>
          {/* Desktop sidebar */}
          <div
            style={{
              height: "auto",
              background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
              overflow: "hidden",
              width: "280px",
            }}
            className="hidden lg:block relative shrink-0 rounded-l-2xl pt-2"
          >
            {/* Menu */}
            <Menu
              mode="inline"
              defaultSelectedKeys={["information"]}
              selectedKeys={[keyActive]}
              items={itemsNavbar.map((item) => ({
                ...item,
                style: {
                  color: "rgba(255, 255, 255, 0.9)",
                  margin: "4px 8px",
                  borderRadius: "8px",
                },
                className: "menu-item-custom",
              }))}
              onClick={(e) => {
                setKeyActive(e.key);
              }}
              style={{
                background: "transparent",
                borderRight: "none",
              }}
            />
            <style>{`
                .ant-menu .menu-item-custom {
                  color: rgba(255, 255, 255, 0.9) !important;
                  border-radius: 8px !important;
                }
                .ant-menu .menu-item-custom:hover {
                  background: rgba(255, 255, 255, 0.15) !important;
                  color: white !important;
                }
                .ant-menu .menu-item-custom.ant-menu-item-selected {
                  background: rgba(255, 255, 255, 0.25) !important;
                  color: white !important;
                  font-weight: 600 !important;
                }
                .ant-menu .menu-item-custom.ant-menu-item-selected::after {
                  display: none !important;
                }
              `}</style>
          </div>
          {/* Content */}
          <div className="bg-white shadow-inner -m-4 lg:m-0 lg:grow rounded-b-2xl lg:rounded-r-2xl overflow-clip">
            <div
              style={{
                margin: "0",
                background: "#fafafa",
                minHeight: "500px",
              }}
              className="transition-all duration-300"
            >
              {keyActive === "information" && <AccountInformation />}
              {keyActive === "order" && <AccountOrders />}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const AccountInformation = () => {
  const axiosInstance = useAxiosAuth();

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [refresh, setRefresh] = useState(0);
  const { data: session, update } = useSession();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update data
  const handleChangeData = async (values: Partial<Customer>) => {
    const dataToUpdate: Partial<Customer> = {};

    if (values.firstName !== user?.firstName)
      dataToUpdate.firstName = values.firstName;
    if (values.lastName !== user?.lastName)
      dataToUpdate.lastName = values.lastName;
    if (values.address !== user?.address) dataToUpdate.address = values.address;
    if (values.phoneNumber !== user?.phoneNumber)
      dataToUpdate.phoneNumber = values.phoneNumber;

    if (Object.keys(dataToUpdate).length === 0) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      await update(dataToUpdate);
      if (user?._id) {
        await axiosInstance.patch(`/customers/${user?._id}`, dataToUpdate);
      }
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      setRefresh((f) => f + 1);
    } catch (error) {
      devLog("Updating error", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const submitNewPassword = async () => {
    try {
      const values = await passwordForm.validateFields();

      if (values.newPassword !== values.confirmPassword) {
        message.error("Mật khẩu xác nhận không khớp!");
        return;
      }

      setLoading(true);
      message.loading("Đang đổi mật khẩu...", 1.5);

      await axiosInstance.patch(`/customers/${user?._id}`, {
        password: values.newPassword,
      });

      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
      setIsChangingPassword(false);
    } catch (err) {
      devLog(err);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} tải lên thành công`);
      setTimeout(() => {
        setRefresh(refresh + 1);
      }, 1000);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm">
        <div
          className="mb-6 border-0 shadow-md rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <UserOutlined className="text-white text-4xl" />
            </div>
            <Title
              level={3}
              className="!text-white !mb-2"
            >
              Chưa đăng nhập
            </Title>
            <Text className="text-white/80 mb-6">
              Vui lòng đăng nhập để xem thông tin cá nhân
            </Text>
            <Link
              href="/dang-nhap"
              className="inline-block"
            >
              <Button
                type="primary"
                size="large"
                className="bg-white text-indigo-600 border-white rounded-lg"
              >
                Đăng nhập ngay
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-none p-0 shadow-sm">
      {/* Profile Section */}
      <div
        className="mb-6 border-0 shadow-md rounded-none overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6 p-4">
          <div className="relative">
            <Avatar
              size={120}
              src={appendDomain(user.imageUrl || "", ASSET_URL)}
              className="border-4 border-white shadow-lg"
            />
            <Upload
              showUploadList={false}
              name="file"
              customRequest={async (options) => {
                try {
                  await axiosInstance.postForm(
                    `/upload/customers/${user._id}/image`,
                    { file: options.file }
                  );
                } catch (e) {
                  console.error(e);
                }
              }}
              onChange={handleAvatarUpload}
            >
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <UploadOutlined className="text-indigo-600" />
              </div>
            </Upload>
          </div>

          <div className="text-center md:text-left flex-1 text-white">
            <Title
              level={3}
              className="!text-white !mb-1"
            >
              {user.firstName} {user.lastName}
            </Title>
            <Text className="text-white/80 text-lg">{user.email}</Text>
            <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
              {user.phoneNumber && (
                <Tag
                  color="green"
                  className="border-0"
                >
                  <PhoneOutlined className="mr-1" />
                  {user.phoneNumber}
                </Tag>
              )}
              {user.address && (
                <Tag
                  color="blue"
                  className="border-0"
                >
                  <EnvironmentOutlined className="mr-1" />
                  {user.address}
                </Tag>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Form */}
      <Card className="mb-6 border-0 shadow-md rounded-2xl">
        <div className="flex items-center justify-between flex-col lg:flex-row mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <UserOutlined className="text-indigo-600 text-lg" />
            </div>
            <Title
              level={4}
              className="!mb-0"
            >
              Thông tin cá nhân
            </Title>
          </div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue({
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                phoneNumber: user.phoneNumber,
              });
              setIsEditing(true);
            }}
            className="bg-indigo-500 border-indigo-500"
            disabled={isEditing}
          >
            Chỉnh sửa
          </Button>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangeData}
          disabled={!isEditing}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="firstName"
              label={<Text strong>Tên</Text>}
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nhập tên"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={<Text strong>Họ</Text>}
              rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nhập họ"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label={<Text strong>Số điện thoại</Text>}
            >
              <Input
                size="large"
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Nhập số điện thoại"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="address"
              label={<Text strong>Địa chỉ</Text>}
            >
              <Input
                size="large"
                prefix={<HomeOutlined className="text-gray-400" />}
                placeholder="Nhập địa chỉ"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label={<Text strong>Email</Text>}
          >
            <Input
              size="large"
              prefix={<MailOutlined className="text-gray-400" />}
              value={user.email}
              disabled
              className="rounded-lg bg-gray-50"
            />
          </Form.Item>

          <div
            className={cn(
              "flex flex-col lg:flex-row gap-3  items-stretch lg:items-center lg:justify-end mt-4"
            )}
          >
            <Button
              size="large"
              onClick={() => {
                setIsEditing(false);
                form.resetFields();
              }}
              className="rounded-lg"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={loading}
              className="bg-indigo-500 border-indigo-500 rounded-lg"
            >
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Card>

      {/* Password Section */}
      <Card className="border-0 shadow-md rounded-2xl">
        <div className="flex items-center justify-between mb-6 flex-col lg:flex-row">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <LockOutlined className="text-red-600 text-lg" />
            </div>
            <Title
              level={4}
              className="!mb-0"
            >
              Bảo mật
            </Title>
          </div>
          <Button
            type="default"
            danger
            icon={<EditOutlined />}
            onClick={() => setIsChangingPassword(true)}
            className="rounded-lg"
            disabled={isChangingPassword}
          >
            Đổi mật khẩu
          </Button>
        </div>

        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={submitNewPassword}
          disabled={!isChangingPassword}
        >
          <Form.Item
            name="oldPassword"
            label={<Text strong>Mật khẩu cũ</Text>}
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu cũ"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={<Text strong>Mật khẩu mới</Text>}
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu mới"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<Text strong>Xác nhận mật khẩu mới</Text>}
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập lại mật khẩu mới"
              className="rounded-lg"
            />
          </Form.Item>

          <div
            className={cn(
              "flex flex-col lg:flex-row gap-3  items-stretch lg:items-center lg:justify-end mt-4"
            )}
          >
            <Button
              size="large"
              onClick={() => {
                setIsChangingPassword(false);
                passwordForm.resetFields();
              }}
              className="rounded-lg"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={loading}
              className="bg-red-500 border-red-500 rounded-lg"
            >
              Cập nhật mật khẩu
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

import { axiosClient } from "@/libraries/axiosConfig";
import { printError } from "@/utils/log";
import { Order, OrderDetail } from "@/utils/types/entityTypes";
import { RestOutlined, SearchOutlined } from "@ant-design/icons";
import {
  // Col,
  Descriptions,
  Divider,
  Modal,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import numeral from "numeral";
import { useEffect } from "react";
import styles from "./style.module.css";

const AccountOrders = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const screens = useBreakpoint();

  const axiosAuth = useAxiosAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  //TableLoading

  const [loadingTable, setLoadingTable] = useState(true);

  const statusMeta: Record<string, { color: string; label: string }> = {
    WAITING: { color: "gold", label: "Chờ xác nhận" },
    ECONFIRMED: { color: "blue", label: "Đã xác nhận" },
    COMPLETED: { color: "green", label: "Hoàn tất" },
    CANCELED: { color: "red", label: "Đã hủy" },
  };

  const paymentMeta: Record<string, string> = {
    COD: "volcano",
    MOMO: "magenta",
    VNPAY: "geekblue",
  };

  const getOrderTotal = (order: Order) => {
    if (!order?.orderDetails) return 0;
    return order.orderDetails.reduce((sum, detail) => {
      const price = detail.price ?? 0;
      return sum + detail.quantity * price * (1 - detail.discount / 100);
    }, 0);
  };

  const orderCount = userOrders.length;
  const totalSpent = userOrders.reduce(
    (sum, order) => sum + getOrderTotal(order),
    0
  );

  useEffect(() => {
    // Check if the selected order exists in the updated dataResource
    const updatedSelectedOrder = userOrders.find(
      (order) => order._id === selectedOrder?._id
    );
    setSelectedOrder(updatedSelectedOrder || null);
  }, [selectedOrder?._id, userOrders]);

  useEffect(() => {
    if (user) {
      axiosAuth
        .get<{ results: Order[]; amountResults: number }>(`/orders/personal`)
        .then((res) => {
          setUserOrders(res.data.results);
          setLoadingTable(false);
        })
        .catch((err) => {
          devLog(err);
          message.error(printError(err), 1);
        })
        .finally(() => {
          setLoadingTable(false);
        });
    }
  }, [axiosAuth, user, user?._id]);

  const ordersColumn: ColumnsType<OrderDetail> = [
    {
      width: "10%",
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      width: "30%",
      title: "Tên sản phẩm",
      dataIndex: "product.name",
      key: "product.name",
      render: (text, record) => {
        return <Text strong>{record?.product?.name}</Text>;
      },
    },
    {
      width: "10%",
      title: "Giá",
      dataIndex: "product.price",
      key: "product.price",
      render: (text, record) => {
        const price = record.price ?? 999 * 1000;
        return (
          <div>
            {price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </div>
        );
      },
    },
    {
      width: "10%",
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (text, record) => {
        return <div>{numeral(record?.discount).format("0,0")}%</div>;
      },
      align: "center",
    },
  ];

  const columns: ColumnsType<Order> = [
    {
      width: "7%",
      title: "No",
      dataIndex: "numberOrder",
      key: "numberOrder",
      render: (text, record, index) => (
        <Text className="text-gray-500">#{index + 1}</Text>
      ),
      align: "center",
    },
    {
      width: "10%",
      title: "Phương thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (text) => (
        <Tag
          color={paymentMeta[text] ?? "default"}
          className={styles.statusTag}
        >
          {text ?? "N/A"}
        </Tag>
      ),
      responsive: ["lg"],
    },
    {
      width: "14%",
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        const meta = statusMeta[text] ?? { color: "default", label: text };
        return (
          <Tag
            color={meta.color}
            className={styles.statusTag}
          >
            {meta.label}
          </Tag>
        );
      },
      align: "center",
      responsive: ["lg"],
    },
    {
      width: "22%",
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      render: (text) => <div className={styles.addressCell}>{text}</div>,
      // responsive: ["md"],
    },
    {
      width: "10%",
      title: "Tổng tiền",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (text, record) => {
        let total = getOrderTotal(record);
        total = Number(total.toFixed(2));
        return (
          <Text strong>
            {total.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        );
      },
      align: "right",
      responsive: ["md"],
    },
    {
      width: "13%",
      title: "Chi tiết đơn hàng",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (text, record) => {
        return (
          <Space
            className="text-end"
            direction={screens.sm ? "horizontal" : "vertical"}
          >
            <Button
              type="dashed"
              onClick={() => {
                setSelectedOrder(record);
              }}
              shape="circle"
              icon={<SearchOutlined />}
              className={styles.actionButton}
            />
            {(record.status === "WAITING" ||
              record.status === "ECONFIRMED") && (
              <>
                <Popconfirm
                  okText="Hủy đơn"
                  cancelText="Thoát"
                  okType="danger"
                  onConfirm={async () => {
                    try {
                      await axiosClient.patch(`/orders/${record._id}`, {
                        status: "CANCELED",
                      });
                    } catch (error) {
                      alert("Hủy đơn hàng thất bại. Vui lòng thử lại.");
                      console.error(error);
                      return;
                    }

                    // if (handleCanceled?.data?._id) {
                    //   await axiosClient
                    //     .post(`/products/orderm/${record._id}/stock`)
                    //     .catch((error) => {
                    //       console.error(error);
                    //     });
                    // } else {
                    //   message.error(`SYSTEM ERROR !!!`);
                    // }
                  }}
                  title={"Bạn chắc chắn sẽ hủy đơn hàng?"}
                >
                  <Button
                    type="dashed"
                    danger
                    icon={<RestOutlined />}
                    className={styles.actionButton}
                  ></Button>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
      align: "center",
    },
  ];
  return (
    <>
      <div className={cn(styles.container)}>
        <Card
          className={styles.ordersCard}
          // bodyStyle={{ padding: 20 }}
          styles={{ body: { padding: 20 } }}
        >
          <div className={cn(styles.header)}>
            <div>
              <Title
                level={4}
                className={styles.title}
              >
                Đơn hàng của bạn
              </Title>
              <Text type="secondary">
                Theo dõi tiến trình xử lý và lịch sử mua hàng gần đây.
              </Text>
            </div>
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <Text className={styles.statLabel}>Tổng đơn</Text>
                <Title
                  level={5}
                  className={styles.statValue}
                >
                  {orderCount}
                </Title>
              </div>
              <div className={styles.statCard}>
                <Text className={styles.statLabel}>Tổng chi tiêu</Text>
                <Title
                  level={5}
                  className={styles.statValue}
                >
                  {totalSpent.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Title>
              </div>
            </div>
          </div>
          <Table
            className={styles.ordersTable}
            tableLayout="fixed"
            loading={loadingTable}
            rowKey={"_id"}
            dataSource={userOrders}
            columns={columns}
            pagination={false}
            size="middle"
            locale={{ emptyText: "Chưa có đơn hàng nào" }}
          />
        </Card>
      </div>
      <Modal
        okType="dashed"
        width={{ xs: "100%", lg: "75%", xl: "1100px" }}
        onCancel={() => {
          setSelectedOrder(null);
        }}
        onOk={() => {
          setSelectedOrder(null);
        }}
        open={selectedOrder !== null}
      >
        {/* <Col> */}
        {selectedOrder && (
          <Card title="Chi tiết đơn hàng">
            <div>
              {/* Description of order */}
              <Descriptions
                className={styles.orderDescriptions}
                bordered
                column={{ xs: 1, md: 2 }}
              >
                <Descriptions.Item label="Mã đơn hàng">
                  {selectedOrder._id}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {(() => {
                    const meta =
                      statusMeta[selectedOrder.status] ??
                      ({
                        color: "default",
                        label: selectedOrder.status,
                      } as { color: string; label: string });
                    return (
                      <Tag
                        color={meta.color}
                        className={styles.statusTag}
                      >
                        {meta.label}
                      </Tag>
                    );
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ giao hàng">
                  {selectedOrder.shippingAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  {selectedOrder.customer?.firstName}{" "}
                  {selectedOrder.customer?.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Nhân viên">
                  {selectedOrder.employee?.firstName}{" "}
                  {selectedOrder.employee?.lastName}
                </Descriptions.Item>
              </Descriptions>
              <Divider />

              {/* Table include product of orderDetails */}
              <Table
                className={styles.orderDetailsTable}
                rowKey="_id"
                scroll={{ x: "max-content", y: "max-content" }}
                dataSource={selectedOrder.orderDetails}
                columns={ordersColumn}
                pagination={false}
              />
            </div>
          </Card>
        )}
        {/* </Col> */}
      </Modal>
    </>
  );
};

export default AccountPage;
