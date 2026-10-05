import { Result, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";

interface ErrorProps {
  statusCode: number;
}

function ErrorComponent({ statusCode }: ErrorProps) {
  const getErrorInfo = (code: number) => {
    const errorMap: Record<number, { title: string; subTitle: string }> = {
      404: {
        title: "Trang không tìm thấy",
        subTitle: "Xin lỗi, trang bạn đang tìm kiếm không tồn tại.",
      },
      500: {
        title: "Lỗi máy chủ",
        subTitle: "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau.",
      },
      403: {
        title: "Truy cập bị từ chối",
        subTitle: "Bạn không có quyền truy cập trang này.",
      },
      503: {
        title: "Dịch vụ không khả dụng",
        subTitle: "Máy chủ hiện đang bảo trì. Vui lòng quay lại sau.",
      },
    };

    return (
      errorMap[code] || {
        title: `Lỗi ${code}`,
        subTitle: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      }
    );
  };

  const errorInfo = getErrorInfo(statusCode);

  const getStatus = (code: number) => {
    if (code === 404) return "404";
    if (code === 403) return "403";
    if (code === 500) return "500";
    if (code === 503) return "500";
    return "error";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <Result
          status={getStatus(statusCode)}
          title={
            <h1 className="text-3xl font-bold text-gray-800">
              {errorInfo.title}
            </h1>
          }
          subTitle={
            <p className="text-base text-gray-600 mt-2">{errorInfo.subTitle}</p>
          }
          extra={
            <Link href="/">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                className="mt-4">
                Quay về trang chủ
              </Button>
            </Link>
          }
          style={{
            padding: "0",
          }}
        />
      </div>
    </div>
  );
}

export default ErrorComponent;
