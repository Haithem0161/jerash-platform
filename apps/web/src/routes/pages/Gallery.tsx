import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { TextReveal } from '@/components/animations/TextReveal'
import { ParallaxImage } from '@/components/animations/ParallaxImage'
import { useGallery } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'
import { Skeleton } from '@/components/ui/skeleton'
import {
  GalleryImage,
  ImageMasonry,
  ImageLightbox,
} from '@/components/gallery'

/**
 * Glass-styled skeleton loader for gallery grid
 */
function GallerySkeleton() {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {[...Array(9)].map((_, i) => (
        <Skeleton
          key={i}
          className="mb-4 break-inside-avoid rounded-2xl bg-white/10"
          style={{ height: `${200 + (i % 3) * 100}px` }}
        />
      ))}
    </div>
  )
}

/**
 * Gallery page with parallax hero, masonry grid, and lightbox viewing.
 * Displays field images with stagger animations and lazy loading.
 */
export function GalleryPage() {
  const { t } = useTranslation('gallery')
  const { data: galleryData, isLoading } = useGallery(1, 50)
  const { resolve } = useBilingual()
  // -1 means lightbox closed, >= 0 is the index of the open image
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const galleryImages = galleryData?.data ?? []

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        url="/gallery"
        image="/images/gallery/jerash-site-05.jpg"
      />

      {/* Hero section */}
      <Section
        fullWidth
        className="relative flex min-h-[60vh] items-center overflow-hidden p-0"
      >
        {/* Parallax background */}
        <div className="absolute inset-0">
          <ParallaxImage
            src="/images/gallery/jerash-site-05.jpg"
            alt=""
            speed={0.15}
            className="h-full w-full"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[oklch(0.08_0.02_250)] via-black/60 to-black/40" />

        {/* Subtle gradient mesh accent */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 80%, oklch(0.40 0.12 250 / 15%) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 60%, oklch(0.65 0.20 50 / 10%) 0%, transparent 40%)
            `,
          }}
        />

        <Container className="relative z-10 py-24">
          <FadeIn>
            <span className="mb-6 inline-block rounded-full border border-jerash-orange/20 bg-jerash-orange/10 px-4 py-1.5 text-sm font-medium text-jerash-orange">
              {t('title')}
            </span>
          </FadeIn>
          <TextReveal
            as="h1"
            className="max-w-3xl text-4xl font-bold text-white md:text-5xl lg:text-6xl"
          >
            {t('title')}
          </TextReveal>
          <FadeIn delay={0.3}>
            <p className="mt-6 max-w-2xl text-lg text-white/50">
              {t('description')}
            </p>
          </FadeIn>
          <div className="mt-8 h-px w-16 bg-jerash-orange" />
        </Container>
      </Section>

      {/* Masonry grid section */}
      <Section>
        <Container>
          {isLoading ? (
            <GallerySkeleton />
          ) : (
            <ImageMasonry>
              {galleryImages.map((image, idx) => (
                <GalleryImage
                  key={image.id}
                  src={image.imageUrl}
                  alt={resolve(image.altEn, image.altAr)}
                  width={image.width}
                  height={image.height}
                  onClick={() => setLightboxIndex(idx)}
                />
              ))}
            </ImageMasonry>
          )}
        </Container>
      </Section>

      {/* Lightbox with zoom and navigation */}
      <ImageLightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        slides={galleryImages.map((img) => ({
          src: img.imageUrl,
          alt: resolve(img.altEn, img.altAr),
          width: img.width,
          height: img.height,
        }))}
        onClose={() => setLightboxIndex(-1)}
      />
    </>
  )
}

export default GalleryPage
