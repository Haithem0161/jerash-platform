import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useScroll, useTransform, useSpring, motion } from 'motion/react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
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
            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 start-4 h-1 w-12 rounded-full bg-jerash-orange" />
          </div>
        </FadeIn>

        {/* Vision & Mission Cards */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <FadeIn direction="up" delay={0.1} className="flex-1">
            <div className="h-full rounded-2xl border p-6 transition-colors hover:border-jerash-blue/40">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-jerash-blue/20 bg-jerash-blue/10">
                  <Eye className="h-5 w-5 text-jerash-blue" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {t('home.vision.title')}
                </h2>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t('home.vision.content')}
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.2} className="flex-1">
            <div className="h-full rounded-2xl border p-6 transition-colors hover:border-jerash-orange/40">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-jerash-orange/20 bg-jerash-orange/10">
                  <Target className="h-5 w-5 text-jerash-orange" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {t('home.mission.title')}
                </h2>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t('home.mission.content')}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </Section>
  )
}
