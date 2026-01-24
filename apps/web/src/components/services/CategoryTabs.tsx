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
 * Animated category filter tabs for the Services page.
 * Features smooth underline animation using layoutId.
 * Accessible with proper ARIA roles.
 */
export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const { t } = useTranslation('services')

  return (
    <div
      role="tablist"
      aria-label={t('title')}
      className="flex flex-wrap justify-center gap-2 md:gap-4"
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
              'relative px-4 py-2 text-sm font-medium transition-colors md:text-base',
              isActive
                ? 'text-jerash-blue'
                : 'text-muted-foreground hover:text-jerash-blue'
            )}
          >
            {t(`categories.${category}`)}
            {isActive && (
              <motion.span
                layoutId="services-category-underline"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-jerash-orange"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
