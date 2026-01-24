import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isRTL } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useHeroSlides } from "@/hooks/api";
import { useBilingual } from "@/hooks/useBilingual";
import { Skeleton } from "@/components/ui/skeleton";

const SLIDE_INTERVAL = 7000; // 7 seconds

/**
 * Skeleton loader for hero slideshow
 */
function HeroSkeleton() {
  return (
    <section className="flex h-[94vh] w-full items-center justify-center px-[1vw] pt-[8vh]">
      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-muted">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 flex items-end pb-24">
          <div className="container mx-auto px-8">
            <div className="max-w-xl">
              <Skeleton className="mb-3 h-10 w-96" />
              <Skeleton className="h-6 w-64" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroSlideshow() {
  const { t, i18n } = useTranslation();
  const rtl = isRTL(i18n.language);
  const { data: slides, isLoading } = useHeroSlides();
  const { resolve } = useBilingual();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Resolve bilingual content for slides
  const resolvedSlides = useMemo(() => {
    if (!slides) return [];
    return slides.map((slide) => ({
      id: slide.id,
      imageUrl: slide.imageUrl,
      title: resolve(slide.titleEn, slide.titleAr),
      subtitle: resolve(slide.subtitleEn, slide.subtitleAr),
    }));
  }, [slides, resolve]);

  const slideCount = resolvedSlides.length;

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const goToPrevious = useCallback(() => {
    if (slideCount === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  }, [slideCount]);

  const goToNext = useCallback(() => {
    if (slideCount === 0) return;
    setCurrentSlide((prev) => (prev === slideCount - 1 ? 0 : prev + 1));
  }, [slideCount]);

  // Auto-advance slides
  useEffect(() => {
    if (slideCount === 0) return;
    const interval = setInterval(goToNext, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [goToNext, slideCount]);

  // Preload first two hero images for smooth initial transition
  useEffect(() => {
    if (!resolvedSlides.length) return;
    resolvedSlides.slice(0, 2).forEach((slide) => {
      const img = new Image();
      img.src = slide.imageUrl;
    });
  }, [resolvedSlides]);

  if (isLoading || resolvedSlides.length === 0) {
    return <HeroSkeleton />;
  }

  const currentSlideData = resolvedSlides[currentSlide];

  return (
    <section className="flex h-[94vh] w-full items-center justify-center px-[1vw] pt-[8vh]">
      <div className="relative h-full w-full overflow-hidden rounded-3xl">
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Hero Image with subtle Ken Burns */}
            <img
              src={currentSlideData.imageUrl}
              alt={currentSlideData.title}
              className="animate-ken-burns-subtle absolute inset-0 h-full w-full object-cover"
              fetchPriority={currentSlide === 0 ? "high" : "auto"}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay with brand color accent */}
        <div className="absolute inset-0 bg-linear-to-t from-jerash-blue-dark/80 via-black/30 to-transparent" />

        {/* Hero Text */}
        <div className="absolute inset-0 flex items-end pb-24">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-xl text-white"
            >
              <h1 className="mb-3 text-2xl font-medium tracking-tight md:text-3xl lg:text-4xl">
                {currentSlideData.title}
              </h1>
              {currentSlideData.subtitle && (
                <p className="text-sm font-light text-white/80 md:text-base">
                  {currentSlideData.subtitle}
                </p>
              )}
              <div className="mt-4 h-px w-16 bg-jerash-orange" />
            </motion.div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={rtl ? goToNext : goToPrevious}
          aria-label={t("home.hero.previous")}
          className={cn(
            "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20",
            "start-4",
          )}
        >
          <ChevronLeft className={cn("h-5 w-5", rtl && "rotate-180")} />
        </button>
        <button
          onClick={rtl ? goToPrevious : goToNext}
          aria-label={t("home.hero.next")}
          className={cn(
            "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20",
            "end-4",
          )}
        >
          <ChevronRight className={cn("h-5 w-5", rtl && "rotate-180")} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {resolvedSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={t("home.hero.goToSlide", { number: index + 1 })}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentSlide === index
                  ? "w-6 bg-jerash-orange"
                  : "w-1.5 bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
