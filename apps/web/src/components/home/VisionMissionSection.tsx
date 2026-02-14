import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScroll, useTransform, useSpring, motion } from 'motion/react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { GlowBorder } from '@/components/animations/GlowBorder'
import { Eye, Target } from 'lucide-react'

export function VisionMissionSection() {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ['start end', 'end start'],
  })
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])
  const scale = useSpring(rawScale, { stiffness: 300, damping: 30 })

  return (
    <Section id="vision-mission">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-5">
        {/* Video Panel */}
        <FadeIn direction="up" className="lg:col-span-3">
          <div
            ref={videoRef}
            className="relative h-full min-h-[280px] overflow-hidden rounded-3xl md:min-h-[400px]"
          >
            <motion.video
              className="absolute inset-0 h-full w-full object-cover"
              src="/video.mp4"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              style={{ scale }}
            />
            {/* Noise texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                backgroundSize: '128px 128px',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 start-4 h-1 w-12 rounded-full bg-jerash-orange" />
          </div>
        </FadeIn>

        {/* Vision & Mission Cards */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <FadeIn direction="up" delay={0.1} className="flex-1">
            <GlowBorder color="blue" className="h-full">
              <div className="glass h-full rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-jerash-blue/20 bg-jerash-blue/10">
                    <Eye
                      className="h-6 w-6 text-jerash-blue"
                      style={{
                        filter:
                          'drop-shadow(0 0 8px oklch(0.40 0.12 250 / 50%))',
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    {t('home.vision.title')}
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-white/60">
                  {t('home.vision.content')}
                </p>
              </div>
            </GlowBorder>
          </FadeIn>

          <FadeIn direction="up" delay={0.2} className="flex-1">
            <GlowBorder color="orange" className="h-full">
              <div className="glass h-full rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-jerash-orange/20 bg-jerash-orange/10">
                    <Target
                      className="h-6 w-6 text-jerash-orange"
                      style={{
                        filter:
                          'drop-shadow(0 0 8px oklch(0.65 0.20 50 / 50%))',
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    {t('home.mission.title')}
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-white/60">
                  {t('home.mission.content')}
                </p>
              </div>
            </GlowBorder>
          </FadeIn>
        </div>
      </div>
    </Section>
  )
}
