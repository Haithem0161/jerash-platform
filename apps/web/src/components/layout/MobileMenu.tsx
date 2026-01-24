import { useState } from 'react'
import { NavLink, Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', key: 'nav.home' },
  { to: '/services', key: 'nav.services' },
  { to: '/hse', key: 'nav.hse' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/contact', key: 'nav.contact' },
  { to: '/careers', key: 'nav.careers' },
] as const

export function MobileMenu() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  // Determine sheet side based on text direction
  const side = i18n.dir() === 'rtl' ? 'right' : 'left'

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={t('common.menu')}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </SheetTrigger>
      <SheetContent side={side} className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle asChild>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <img
                src="/Jerash-logo-color.png"
                alt={t('common.siteName')}
                className="h-8 w-auto"
              />
              <span className="font-bold text-lg">{t('common.siteName')}</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 mt-6 px-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center py-3 px-4 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary bg-accent'
                    : 'text-foreground hover:text-primary hover:bg-accent/50'
                )
              }
            >
              {t(link.key)}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-4 pb-4">
          <div className="pt-4 border-t">
            <LanguageSwitcher />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
