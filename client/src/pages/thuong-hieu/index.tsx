import React from "react";
import { Typography, Row, Col, Card, Timeline, Tag } from "antd";
import {
  TrophyOutlined,
  EyeOutlined,
  RocketOutlined,
  HeartOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { FaGem, FaStore } from "react-icons/fa";
import Head from "next/head";

const { Title, Paragraph, Text } = Typography;

const AboutUs = () => {
  const timelineItems = [
    {
      label: (
        <span className="text-xl md:text-3xl font-serif font-bold text-yellow-500">
          2022
        </span>
      ),
      children: (
        <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-xl md:rounded-2xl border border-white/10 mb-8 md:mb-12 hover:bg-white/20 transition-all cursor-default group">
          <Title
            level={4}
            className="!text-white group-hover:text-yellow-400 transition-colors !text-lg md:!text-xl">
            Tăng tốc tái tạo – Ứng biến vươn cao
          </Title>
          <Paragraph className="!text-gray-300 leading-relaxed text-sm md:text-md">
            Năm 2022 chứng kiến kết quả kinh doanh kỷ lục với doanh thu thuần
            33,876 tỷ đồng (tăng 73.3%) và lợi nhuận 1,807 tỷ đồng. Tiếp tục
            kiên định với trọng tâm duy trì vị thế số một thị trường.
          </Paragraph>
        </div>
      ),
      dot: (
        <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.8)]"></div>
      ),
    },
    {
      label: (
        <span className="text-xl md:text-3xl font-serif font-bold text-blue-400">
          2018 - 2021
        </span>
      ),
      children: (
        <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-xl md:rounded-2xl border border-white/10 mb-8 md:mb-12 hover:bg-white/20 transition-all cursor-default group">
          <Title
            level={4}
            className="!text-white group-hover:text-blue-400 transition-colors !text-lg md:!text-xl">
            Kiến tạo kỳ tích mới
          </Title>
          <Paragraph className="!text-gray-300 leading-relaxed text-sm md:text-md">
            Trở thành nhà bán lẻ kim hoàn số 1 Châu Á. Hợp tác quốc tế với Walt
            Disney và Pandora. Nhận giải thưởng Doanh nghiệp xuất sắc nhất Châu
            Á - Thái Bình Dương (JNA 2020).
          </Paragraph>
        </div>
      ),
      dot: (
        <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.8)]"></div>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <Head>
        <title>Thuong hieu | Jewelry Shop</title>
      </Head>
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 scale-105"
          style={{
            backgroundImage: "url('/brand/hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.5)",
          }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <Title
            level={1}
            className="!text-white !mb-4 text-4xl md:text-7xl font-serif tracking-widest uppercase opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
            Jewel
          </Title>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6 animate-[scaleIn_0.8s_ease-out_forwards]"></div>
          <Paragraph className="text-lg md:text-2xl font-light text-white italic tracking-wide opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
            &quot;Niềm Tin và Phong Cách&quot;
          </Paragraph>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Intro Section - Side by Side */}
        <Row
          gutter={[32, 32]}
          align="middle"
          className="mb-16 md:mb-32">
          <Col
            xs={24}
            lg={12}>
            <div className="relative group">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-yellow-500/20 rounded-2xl group-hover:-top-6 group-hover:-left-6 transition-all duration-500"></div>
              <img
                src="/brand/showroom.png"
                alt="Jewel Showroom"
                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-[280px] md:h-[400px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </Col>
          <Col
            xs={24}
            lg={12}>
            <div className="pl-0 lg:pl-10">
              <Tag
                color="gold"
                className="mb-6 uppercase tracking-widest px-4 py-1 font-semibold border-none rounded-full bg-yellow-100 text-yellow-700">
                Tinh hoa kim hoàn
              </Tag>
              <Title
                level={2}
                className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                Hành trình lan tỏa vẻ đẹp đẳng cấp
              </Title>
              <Paragraph className="text-lg text-gray-600 leading-relaxed mb-10">
                Jewel khơi nguồn từ niềm đam mê với những viên đá quý và khát
                khao tôn vinh vẻ đẹp của mỗi cá nhân. Chúng tôi không chỉ chế
                tác trang sức, chúng tôi tạo nên những kiệt tác nghệ thuật mang
                đậm dấu ấn phong cách riêng.
              </Paragraph>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="bg-yellow-500/10 p-3 rounded-lg mr-4 text-yellow-600 mt-1">
                    <FaStore size={22} />
                  </div>
                  <div>
                    <Text
                      strong
                      className="block text-lg mb-1">
                      Mạng lưới chi nhánh
                    </Text>
                    <Text className="text-gray-500">
                      Trên 12 trung tâm kim hoàn tại 8 tỉnh thành toàn quốc.
                    </Text>
                  </div>
                </div>
                <div className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="bg-blue-500/10 p-3 rounded-lg mr-4 text-blue-600 mt-1">
                    <GlobalOutlined style={{ fontSize: 22 }} />
                  </div>
                  <div>
                    <Text
                      strong
                      className="block text-lg mb-1">
                      Trụ sở chính
                    </Text>
                    <Text className="text-gray-500">
                      Đà Nẵng, trung tâm kết nối tinh hoa miền Trung.
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Vision & Mission - Cards with glassmorphism feel */}
        <div className="mb-16 md:mb-32">
          <div className="text-center mb-10 md:mb-16">
            <Title
              level={2}
              className="font-serif text-2xl md:text-4xl">
              Tầm nhìn & Sứ mệnh
            </Title>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mt-2"></div>
          </div>
          <Row gutter={[16, 16]}>
            <Col
              xs={24}
              md={8}>
              <Card className="h-full border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white group p-4 text-center">
                <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-500 text-yellow-600">
                  <EyeOutlined style={{ fontSize: 36 }} />
                </div>
                <Title
                  level={4}
                  className="group-hover:text-yellow-600 transition-colors">
                  Tầm nhìn
                </Title>
                <Paragraph className="text-gray-500 leading-relaxed">
                  Trở thành công ty hàng đầu Châu Á về chế tác trang sức và bán
                  lẻ sản phẩm tôn vinh vẻ đẹp, vươn tầm thế giới với những giá
                  trị bền vững.
                </Paragraph>
              </Card>
            </Col>
            <Col
              xs={24}
              md={8}>
              <Card className="h-full border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white group p-4 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-red-500 group-hover:text-white transition-colors duration-500 text-red-500">
                  <RocketOutlined style={{ fontSize: 36 }} />
                </div>
                <Title
                  level={4}
                  className="group-hover:text-red-500 transition-colors">
                  Sứ mệnh
                </Title>
                <Paragraph className="text-gray-500 leading-relaxed">
                  Jewel không ngừng sáng tạo để mang lại những sản phẩm tinh tế
                  với giá trị thật để tôn vinh vẻ đẹp cho con người và cuộc
                  sống, mang niềm hạnh phúc cho khách hàng.
                </Paragraph>
              </Card>
            </Col>
            <Col
              xs={24}
              md={8}>
              <Card className="h-full border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white group p-4">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 text-blue-500">
                  <HeartOutlined style={{ fontSize: 36 }} />
                </div>
                <Title
                  level={4}
                  className="group-hover:text-blue-600 transition-colors text-center">
                  Giá trị cốt lõi
                </Title>
                <ul className="text-gray-500 space-y-3 mt-4">
                  <li className="flex items-center">
                    <CheckCircleOutlined className="text-green-500 mr-3" />{" "}
                    Chính trực để trường tồn
                  </li>
                  <li className="flex items-center">
                    <CheckCircleOutlined className="text-green-500 mr-3" /> Kiên
                    định bám mục tiêu
                  </li>
                  <li className="flex items-center">
                    <CheckCircleOutlined className="text-green-500 mr-3" /> Quan
                    tâm cùng phát triển
                  </li>
                  <li className="flex items-center">
                    <CheckCircleOutlined className="text-green-500 mr-3" /> Tận
                    tâm vì khách hàng
                  </li>
                  <li className="flex items-center">
                    <CheckCircleOutlined className="text-green-500 mr-3" /> Tiên
                    phong tạo khác biệt
                  </li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>

        {/* History Section - Modern Timeline */}
        <div className="mb-16 md:mb-32 py-12 md:py-24 bg-gray-900 rounded-2xl md:rounded-[3rem] px-4 md:px-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 md:p-12 opacity-10 rotate-12">
            <FaGem
              size={150}
              className="text-white md:w-[300px]"
            />
          </div>

          <div className="text-center mb-10 md:mb-20 relative z-10">
            <Title
              level={2}
              className="!text-white font-serif !mb-2 md:!mb-4 text-2xl md:text-4xl">
              Hành trình phát triển
            </Title>
            <Paragraph className="text-gray-400 text-sm md:text-lg">
              Những cột mốc vàng son trên con đường chinh phục thị trường
            </Paragraph>
          </div>

          <div className="relative z-10">
            {/* Mobile view: Simple cards with year on top, content below */}
            <div className="md:hidden space-y-6">
              {timelineItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                  <div className="text-2xl font-serif font-bold text-yellow-500 mb-3">
                    {item.label}
                  </div>
                  <div className="text-white">{item.children}</div>
                </div>
              ))}
            </div>

            {/* Desktop view: Timeline with alternate layout */}
            <div className="hidden md:block">
              <Timeline
                mode="alternate"
                items={timelineItems}
              />
            </div>
          </div>
        </div>

        {/* Achievement Section - Grid */}
        <div className="mb-16 md:mb-32">
          <div className="text-center mb-10 md:mb-16">
            <Tag
              color="blue"
              className="mb-2 md:mb-4">
              REWARDS & RECOGNITION
            </Tag>
            <Title
              level={2}
              className="font-serif !mt-0 text-2xl md:text-4xl">
              Thành tựu đạt được
            </Title>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mt-2"></div>
          </div>
          <Row gutter={[16, 16]}>
            {[
              { title: "Top 3 nhà bán lẻ khu vực Châu Á", org: "JNA" },
              { title: "Top 6 thương hiệu của năm", org: "JNA" },
              { title: "Môi trường làm việc tốt nhất Châu Á", org: "HR Asia" },
              { title: "Hàng Việt Nam chất lượng cao", org: "Chứng nhận" },
              { title: "Thương hiệu quốc gia", org: "Vinh danh" },
              { title: "Top 50 công ty kinh doanh hiệu quả", org: "Forbes" },
              { title: "Top 100 môi trường tốt nhất VN", org: "Anphabe" },
              { title: "Top 50 thương hiệu tuyển dụng", org: "Vinh danh" },
            ].map((item, index) => (
              <Col
                xs={24}
                sm={12}
                md={6}
                key={index}>
                <div className="bg-white border-b-4 border-b-transparent p-4 md:p-8 rounded-xl md:rounded-2xl text-center shadow-sm hover:shadow-xl hover:border-b-yellow-500 transition-all duration-300 group h-full">
                  <div className="text-yellow-600 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrophyOutlined
                      style={{ fontSize: 28 }}
                      className="md:text-[40px]"
                    />
                  </div>
                  <Text
                    strong
                    className="block text-base md:text-lg mb-1 md:mb-2">
                    {item.title}
                  </Text>
                  <Text className="text-gray-400 text-xs md:text-sm italic">
                    {item.org}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Closing Banner */}
        <div className="relative h-[300px] md:h-[450px] rounded-2xl md:rounded-[3rem] overflow-hidden group">
          <img
            src="/brand/craftsmanship.png"
            alt="Craftsmanship"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center text-center p-6 md:p-12">
            <div className="max-w-3xl">
              <Title
                level={2}
                className="!text-white mb-4 md:mb-8 text-2xl md:text-5xl font-serif">
                Mỗi sản phẩm là một tuyệt tác
              </Title>
              <Paragraph className="text-white text-base md:text-xl opacity-90 font-light leading-relaxed hidden md:block">
                Tại Jewel, chúng tôi tin rằng trang sức không chỉ là vật trang
                sức, mà còn là tâm hồn và phong cách của người sở hữu. Chúng tôi
                cam kết mang lại giá trị thật để tôn vinh vẻ đẹp con người.
              </Paragraph>
              <Paragraph className="text-white text-sm md:text-xl opacity-90 font-light leading-relaxed md:hidden">
                Tại Jewel, chúng tôi tin rằng trang sức không chỉ là vật trang
                sức, mà còn là tâm hồn và phong cách của người sở hữu.
              </Paragraph>
              <div className="mt-6 md:mt-10">
                <div className="inline-block w-12 md:w-16 h-1 bg-yellow-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        jsx
        global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
