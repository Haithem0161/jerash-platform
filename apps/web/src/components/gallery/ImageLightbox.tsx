import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

interface ImageLightboxProps {
  open: boolean
  index: number
  slides: Array<{ src: string; alt: string; width: number; height: number }>
  onClose: () => void
}

/**
 * Lightbox wrapper with zoom plugin for gallery image viewing.
 * Supports pinch zoom, scroll zoom, swipe navigation, and keyboard controls.
 * Dark backdrop ensures images pop (per CONTEXT.md).
 */
export function ImageLightbox({
  open,
  index,
  slides,
  onClose,
}: ImageLightboxProps) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Zoom]}
      zoom={{
        maxZoomPixelRatio: 2,
        scrollToZoom: true,
        doubleClickMaxStops: 2,
      }}
      carousel={{
        finite: true, // Don't loop, 26 images has clear start/end
      }}
      controller={{
        closeOnBackdropClick: true, // Important for mobile UX
      }}
      styles={{
        container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
      }}
    />
  )
}
