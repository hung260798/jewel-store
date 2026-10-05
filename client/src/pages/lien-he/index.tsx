import React from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Input,
  Form,
  Button,
  Space,
  Divider,
} from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  InstagramOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { FaGem } from "react-icons/fa";
import Head from "next/head";

const { Title, Paragraph, Text } = Typography;

interface FormValues {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const onFinish = (values: FormValues) => {
    console.log("Form values:", values);
    // Add your form submission logic here
  };

  const contactInfo = [
    {
      icon: <EnvironmentOutlined className="text-3xl" />,
      color: "bg-blue-500",
      title: "Địa chỉ",
      content: "Thanh Sơn, Thanh Bình, Hải Châu, Đà Nẵng, Việt Nam",
      subContent: "Trụ sở chính",
    },
    {
      icon: <PhoneOutlined className="text-3xl" />,
      color: "bg-green-500",
      title: "Điện thoại",
      content: "(+84) 356 057 252",
      subContent: "Tổng đài CSKH: 1800 000 000",
    },
    {
      icon: <MailOutlined className="text-3xl" />,
      color: "bg-red-500",
      title: "Email",
      content: "contact@jewelshop.com",
      subContent: "Hỗ trợ 24/7",
    },
    {
      icon: <ClockCircleOutlined className="text-3xl" />,
      color: "bg-amber-500",
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 7: 8:00 - 20:00",
      subContent: "Chủ nhật: 9:00 - 17:00",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Lien he | Jewelry Shop</title>
      </Head>
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/brand/hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)",
          }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <div className="flex items-center justify-center mb-4">
            <FaGem className="text-4xl md:text-6xl text-amber-400 mr-3" />
          </div>
          <Title
            level={1}
            className="!text-white !mb-4 text-3xl md:text-5xl font-serif tracking-wider uppercase">
            Liên hệ
          </Title>
          <div className="w-16 h-1 bg-amber-400 mx-auto mb-4"></div>
          <Paragraph className="text-lg md:text-xl text-gray-200 font-light">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </Paragraph>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Contact Info Cards */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Title
              level={2}
              className="font-serif text-2xl md:text-4xl mb-4">
              Thông tin liên hệ
            </Title>
            <div className="w-16 h-1 bg-amber-500 mx-auto"></div>
            <Paragraph className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Với hệ thống hơn 12 trung tâm kim hoàn tại 8 tỉnh thành trên cả
              nước, chúng tôi luôn sẵn sàng phục vụ bạn mọi lúc, mọi nơi.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {contactInfo.map((item, index) => (
              <Col
                xs={24}
                sm={12}
                lg={6}
                key={index}>
                <Card
                  className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden"
                  bodyStyle={{ padding: "24px" }}>
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      {item.icon}
                    </div>
                    <Title
                      level={4}
                      className="mb-2 text-lg">
                      {item.title}
                    </Title>
                    <Text className="block text-gray-700 font-medium">
                      {item.content}
                    </Text>
                    <Text className="block text-gray-500 text-sm">
                      {item.subContent}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Contact Form & Map Section */}
        <Row
          gutter={[32, 32]}
          className="mb-16">
          {/* Contact Form */}
          <Col
            xs={24}
            lg={12}>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                  <SendOutlined className="text-amber-600 text-xl" />
                </div>
                <div>
                  <Title
                    level={3}
                    className="mb-0 font-serif">
                    Gửi tin nhắn cho chúng tôi
                  </Title>
                  <Text className="text-gray-500 text-sm">
                    Chúng tôi sẽ phản hồi trong vòng 24 giờ
                  </Text>
                </div>
              </div>

              <Form
                layout="vertical"
                onFinish={onFinish}
                size="large"
                className="contact-form">
                <Row gutter={16}>
                  <Col
                    xs={24}
                    md={12}>
                    <Form.Item
                      name="name"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ tên" },
                      ]}>
                      <Input
                        placeholder="Họ và tên"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    md={12}>
                    <Form.Item
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                      ]}>
                      <Input
                        placeholder="Số điện thoại"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}>
                  <Input
                    placeholder="Email"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="subject"
                  rules={[
                    { required: true, message: "Vui lòng nhập tiêu đề" },
                  ]}>
                  <Input
                    placeholder="Tiêu đề"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="message"
                  rules={[
                    { required: true, message: "Vui lòng nhập nội dung" },
                  ]}>
                  <Input.TextArea
                    rows={4}
                    placeholder="Nội dung tin nhắn..."
                    className="rounded-lg resize-none"
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full bg-amber-500 border-amber-500 hover:bg-amber-600 hover:border-amber-600 h-12 text-lg font-medium rounded-lg transition-all duration-300"
                    icon={<SendOutlined />}>
                    Gửi tin nhắn
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>

          {/* Map Section */}
          <Col
            xs={24}
            lg={12}>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <EnvironmentOutlined className="text-blue-600 text-xl" />
                </div>
                <div>
                  <Title
                    level={3}
                    className="mb-0 font-serif">
                    Hệ thống cửa hàng
                  </Title>
                  <Text className="text-gray-500 text-sm">
                    Tìm địa điểm gần bạn nhất
                  </Text>
                </div>
              </div>

              {/* Map Placeholder - Replace with actual map integration */}
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-gray-100 mb-6">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/brand/showroom.png')",
                    filter: "brightness(0.7)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-xl text-center shadow-lg">
                    <EnvironmentOutlined className="text-3xl text-red-500 mb-2" />
                    <Text
                      strong
                      className="block text-gray-800">
                      Trụ sở chính - Đà Nẵng
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Thanh Sơn, Thanh Bình, Hải Châu
                    </Text>
                  </div>
                </div>
              </div>

              {/* Store Locations Quick Links */}
              <div className="grid grid-cols-2 gap-3">
                {["Đà Nẵng", "Hà Nội", "TP. Hồ Chí Minh", "Huế"].map(
                  (city, idx) => (
                    <Button
                      key={idx}
                      type="default"
                      className="rounded-lg border-gray-300 hover:border-amber-500 hover:text-amber-600 transition-all duration-300">
                      <EnvironmentOutlined className="mr-2" />
                      {city}
                    </Button>
                  )
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* Social Media Section */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white">
          <Title
            level={2}
            className="!text-white font-serif mb-4">
            Kết nối với chúng tôi
          </Title>
          <Paragraph className="text-blue-200 mb-8 max-w-xl mx-auto">
            Theo dõi chúng tôi trên mạng xã hội để cập nhật những tin tức và ưu
            đãi mới nhất
          </Paragraph>

          <Space
            size="large"
            className="flex-wrap justify-center">
            <a
              href="#"
              className="w-14 h-14 rounded-xl bg-white/10 hover:bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
              title="Facebook">
              <FacebookOutlined style={{ fontSize: 28 }} />
            </a>
            <a
              href="#"
              className="w-14 h-14 rounded-xl bg-white/10 hover:bg-pink-600 flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
              title="Instagram">
              <InstagramOutlined style={{ fontSize: 28 }} />
            </a>
            <a
              href="mailto:contact@jewelshop.com"
              className="w-14 h-14 rounded-xl bg-white/10 hover:bg-red-600 flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
              title="Email">
              <MailOutlined style={{ fontSize: 28 }} />
            </a>
          </Space>

          <Divider className="border-white/20 my-8" />

          <Row
            gutter={[24, 24]}
            justify="center">
            <Col
              xs={24}
              sm={8}>
              <div className="text-center">
                <Text
                  strong
                  className="block text-3xl font-serif text-amber-400">
                  12+
                </Text>
                <Text className="text-blue-200">Trung tâm kim hoàn</Text>
              </div>
            </Col>
            <Col
              xs={24}
              sm={8}>
              <div className="text-center">
                <Text
                  strong
                  className="block text-3xl font-serif text-amber-400">
                  8
                </Text>
                <Text className="text-blue-200">Tỉnh thành</Text>
              </div>
            </Col>
            <Col
              xs={24}
              sm={8}>
              <div className="text-center">
                <Text
                  strong
                  className="block text-3xl font-serif text-amber-400">
                  24/7
                </Text>
                <Text className="text-blue-200">Hỗ trợ khách hàng</Text>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
