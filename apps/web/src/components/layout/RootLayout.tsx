import { Outlet, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useLayoutEffect, useEffect } from "react";
import { useLenis } from "lenis/react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { SkipLinks } from "@/components/common/SkipLinks";
import { isRTL } from "@/lib/i18n";

export function RootLayout() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lenis = useLenis();

  // Ensure direction is always correct - runs synchronously before paint
  useLayoutEffect(() => {
    const dir = isRTL(i18n.language) ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language, location.pathname]);

  // Scroll to top on route change using Lenis
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, lenis]);

  return (
    <>
      <SkipLinks />
      <LoadingOverlay />
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
