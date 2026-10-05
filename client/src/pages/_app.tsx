import AppWrapper from "@/components/PageSections/AppWrapper";
import "@/styles/globals.css";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
// import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <StyleProvider layer>
        {/* Đồng bộ với breakpoints của tailwind */}
        <ConfigProvider
          theme={{
            token: {
              screenXS: 0,
              screenSM: 640,
              screenMD: 768,
              screenLG: 1024,
              screenXL: 1280,
              screenXXL: 1536,
              screenXSMin: 0,
              screenSMMin: 640,
              screenMDMin: 768,
              screenLGMin: 1024,
              screenXLMin: 1280,
              screenXXLMin: 1536,
              screenXSMax: 639,
              screenSMMax: 767,
              screenMDMax: 1023,
              screenLGMax: 1279,
              screenXLMax: 1535,
            },
          }}
        >
          <AppWrapper
            Component={Component}
            pageProps={pageProps}
          />
        </ConfigProvider>
      </StyleProvider>
    </SessionProvider>
  );
}
