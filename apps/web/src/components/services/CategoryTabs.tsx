import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export type FilterCategory = 'all' | 'production' | 'wireline' | 'consultancy' | 'other'

const categories: FilterCategory[] = ['all', 'production', 'wireline', 'consultancy', 'other']

interface CategoryTabsProps {
  activeCategory: FilterCategory
  onCategoryChange: (category: FilterCategory) => void
}

/**
 * Glass pill category filter tabs for the Services page.
 * Active tab has an animated orange pill background via layoutId.
 * Accessible with proper ARIA roles.
 */
export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const { t } = useTranslation('services')

  return (
    <div
      role="tablist"
      aria-label={t('title')}
      className="flex flex-wrap justify-center gap-2 md:gap-3"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category
        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoryChange(category)}
            className={cn(
              'relative rounded-full px-5 py-2 text-sm font-medium transition-colors md:text-base',
              isActive
                ? 'text-white'
                : 'text-white/50 hover:text-white/80'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="services-category-pill"
                className="absolute inset-0 rounded-full border border-jerash-orange/30 bg-jerash-orange/15"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            {!isActive && (
              <span className="absolute inset-0 rounded-full border border-white/10" />
            )}
            <span className="relative z-10">{t(`categories.${category}`)}</span>
          </button>
        )
      })}
    </div>
  )
}
