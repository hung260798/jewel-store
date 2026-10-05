import Footer from "@/components/PageSections/Footer/Footer";
import NavbarTailwind from "@/components/PageSections/Navbar/Navbar";
import LoadingBar from "@/components/Placeholders/Loading/BarLoading";
import { useCartStore } from "@/hooks/storeSlices/CartSlice";
import useLayer from "@/hooks/ui/layer";
import { devLog } from "@/utils/log";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import { useEffect } from "react";
// import { useEffect } from "react";

const queryClient = new QueryClient();

function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default function AppWrapper({
  Component,
  pageProps,
}: Pick<AppProps, "Component" | "pageProps">) {
  const setIds = useLayer((s) => s.setIds);
  const globalLoading = useLayer((s) => s.globalLoading);
  const { data: session } = useSession();
  const getDataServer = useCartStore((state) => state.getDataServer);

  useEffect(() => {
    if (!session?.carts) {
      return;
    }
    getDataServer?.(session?.carts, session?.carts.customerId);
    devLog("pages/index.tsx cartId:", session?.carts._id);
  }, [session?.carts]);

  return (
    <>
      <QueryProvider>
        <main
          className="flex flex-col min-h-screen items-center"
          onClick={() => {
            setIds([]);
          }}
        >
          <NavbarTailwind />
          <section className="grow w-full">
            <Component {...pageProps} />
          </section>
          <Footer />
        </main>
        {/* {globalLoading && <LoadingBar isVisible={globalLoading} />} */}
        <LoadingBar isVisible={globalLoading} />
      </QueryProvider>
    </>
  );
}
