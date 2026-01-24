import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Container } from '@/components/layout/Container'

export function HSEHero() {
  const { t } = useTranslation('hse')

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image - using placeholder for now */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hse/hse-hero.jpg')" }}
      />

      {/* Dark Gradient Overlay for text readability (WCAG 4.5:1 contrast) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
              <span className="text-jerash-orange">{t('hero.title')}</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90">
              {t('hero.subtitle')}
            </p>
          </motion.div>
        </Container>
      </div>
    </section>
  )
}
