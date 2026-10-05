import Image from "next/image";
import Link from "next/link";
import dinamontImage from "../Navbar/transparent-jewelry-icon-diamond-icon-60251ec5ca3757.4392206316130454458283.png";
import {
  FacebookOutlined,
  InstagramOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full">
      <footer className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto w-full max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Image
                    width={36}
                    src={dinamontImage}
                    alt="Jewelry Logo"
                    className="drop-shadow-md"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
                  Jewel Shop
                </span>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Công ty cổ phần trang sức & đá quý Jewel Thanh Sơn. Chuyên cung
                cấp các sản phẩm trang sức cao cấp và thiết kế độc đáo.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-3">
                  <PhoneOutlined className="text-blue-600 mt-1 flex-shrink-0" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">Hotline: 0356 057 252</p>
                    <p className="text-xs">Tổng đài CSKH: 18000000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <EnvironmentOutlined className="text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phường Thanh Bình, Quận Hải Châu, TP. Đà Nẵng
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Danh mục
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Trang chủ", path: "/" },
                  { name: "Sản phẩm", path: "/san-pham" },
                  { name: "Thương hiệu", path: "/thuong-hieu" },
                  { name: "Giới thiệu", path: "/lien-he" },
                ].map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium">
                      → {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thanh toán
              </h3>
              <ul className="space-y-3">
                {[
                  "MOMO",
                  "VN PAY",
                  "Chuyển khoản ngân hàng",
                  "Thanh toán tại cửa hàng",
                ].map((method) => (
                  <li key={method}>
                    <p className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium cursor-pointer">
                      → {method}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Kết nối với chúng tôi
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Theo dõi mạng xã hội để cập nhật tin tức mới nhất
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-200 transform hover:scale-110"
                  title="Facebook">
                  <FacebookOutlined size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-200 transform hover:scale-110"
                  title="Instagram">
                  <InstagramOutlined size={20} />
                </a>
                <a
                  href="mailto:support@jewelshop.com"
                  className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-red-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-200 transform hover:scale-110"
                  title="Email">
                  <MailOutlined size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-300 dark:border-gray-700 mb-6" />

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {currentYear}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                Jewel Shop
              </span>
              . Bảo lưu mọi quyền.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Chính sách bảo mật
              </Link>
              <Link
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Điều khoản dịch vụ
              </Link>
              <Link
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
