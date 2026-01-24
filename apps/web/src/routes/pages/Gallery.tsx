import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { useGallery } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'
import { Skeleton } from '@/components/ui/skeleton'
import {
  GalleryImage,
  ImageMasonry,
  ImageLightbox,
} from '@/components/gallery'

/**
 * Skeleton loader for gallery grid
 */
function GallerySkeleton() {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {[...Array(9)].map((_, i) => (
        <Skeleton
          key={i}
          className="mb-4 break-inside-avoid"
          style={{ height: `${200 + (i % 3) * 100}px` }}
        />
      ))}
    </div>
  )
}

/**
 * Gallery page with masonry grid layout and lightbox viewing.
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

      <Section className="py-16 md:py-20">
        <Container>
          {/* Simple title header per CONTEXT.md */}
          <FadeIn className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-jerash-blue md:text-4xl lg:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-muted-foreground">{t('description')}</p>
          </FadeIn>

          {/* Masonry grid with stagger animation */}
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
