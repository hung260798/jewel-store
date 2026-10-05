// pages/_error.tsx

import React from "react";
import { NextPageContext } from "next";
import ErrorComponent from "@/components/Placeholders/Errors";

interface ErrorProps {
  statusCode: number;
}

function Error({ statusCode }: ErrorProps) {
  return <ErrorComponent statusCode={statusCode} />;
}

// Hàm này được Next.js dùng để lấy mã lỗi
Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
