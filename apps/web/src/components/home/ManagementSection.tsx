import { useTranslation } from "react-i18next";
import { Section } from "@/components/layout/Section";
import { FadeIn } from "@/components/animations";

/**
 * Management philosophy section.
 * Displays leadership values with 60/40 text-image layout.
 * Image positioned on the end side (right in LTR, left in RTL).
 */
export function ManagementSection() {
  const { t } = useTranslation();

  return (
    <Section id="management">
      <div className="grid items-center gap-8 md:grid-cols-5 md:gap-12">
        {/* Text content - 60% (3 columns) */}
        <FadeIn className="md:col-span-3">
          <h2 className="text-3xl font-bold md:text-4xl">
            {t("home.management.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("home.management.content")}
          </p>
        </FadeIn>

        {/* Image - 40% (2 columns) */}
        <FadeIn direction="left" className="md:col-span-2">
          <img
            src="/management.jpg"
            alt={t("home.management.title")}
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </FadeIn>
      </div>
    </Section>
  );
}
