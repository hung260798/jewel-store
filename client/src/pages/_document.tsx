import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import Providers from "@/components/Providers/SessionProviders";

export default function MyDocument() {
  return (
    <Html lang="en">
      <title>Jewelry Shop</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <Head />
      <body>
        <Providers>
          <Main />
          <NextScript />
        </Providers>
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};
