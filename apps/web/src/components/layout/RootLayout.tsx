import { Outlet, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { SkipLinks } from "@/components/common/SkipLinks";
import { isRTL } from "@/lib/i18n";

export function RootLayout() {
  const { i18n } = useTranslation();
  const location = useLocation();

  // Ensure direction is always correct - runs synchronously before paint
  // This catches any edge cases where direction might be reset during navigation
  useLayoutEffect(() => {
    const dir = isRTL(i18n.language) ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language, location.pathname]);

  // Composite key ensures transitions on both route changes AND language changes
  const pageKey = `${location.pathname}-${i18n.language}`;

  return (
    <>
      <SkipLinks />
      <LoadingOverlay />
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <AnimatePresence
          mode="wait"
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <motion.main
            id="main-content"
            key={pageKey}
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </>
  );
}
