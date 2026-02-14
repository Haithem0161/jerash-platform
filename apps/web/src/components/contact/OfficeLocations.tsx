import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin, Clock } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useOffices } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'

/**
 * Skeleton loader for office locations
 */
function OfficeLocationsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Skeleton className="mx-auto h-8 w-48 bg-white/10" />
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        <Skeleton className="h-10 bg-white/10" />
        <Skeleton className="h-10 bg-white/10" />
        <Skeleton className="h-10 bg-white/10" />
      </div>
      <div className="glass rounded-2xl">
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-16 w-full bg-white/10" />
              <Skeleton className="h-16 w-full bg-white/10" />
              <Skeleton className="h-16 w-full bg-white/10" />
              <Skeleton className="h-16 w-full bg-white/10" />
            </div>
            <Skeleton className="h-64 w-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Tabbed office locations display.
 * No default tab selected - user must click to view an office.
 * Per CONTEXT.md: Unlike footer (defaults to Basrah), show all three equally.
 */
export function OfficeLocations() {
  const { t } = useTranslation('contact')
  const { data: offices, isLoading } = useOffices()
  const { resolve } = useBilingual()
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined)

  if (isLoading) {
    return <OfficeLocationsSkeleton />
  }

  if (!offices || offices.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto mb-2 h-8 w-8 text-white/20" />
        <p className="text-white/40">{t('offices.noOffices')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">{t('offices.title')}</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
          {offices.map((office) => (
            <TabsTrigger
              key={office.id}
              value={office.id}
              className="text-white/50 data-[state=active]:bg-jerash-orange/15 data-[state=active]:text-white data-[state=active]:border-jerash-orange/30 data-[state=active]:shadow-none"
            >
              {resolve(office.nameEn, office.nameAr)}
            </TabsTrigger>
          ))}
        </TabsList>

        {offices.map((office) => (
          <TabsContent key={office.id} value={office.id}>
            <div className="glass rounded-2xl">
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Office Details */}
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-jerash-orange" />
                      <div>
                        <h4 className="mb-1 font-semibold text-white">{t('offices.email')}</h4>
                        <a
                          href={`mailto:${office.email}`}
                          className="text-white/50 hover:text-jerash-orange transition-colors"
                        >
                          {office.email}
                        </a>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-jerash-orange" />
                      <div>
                        <h4 className="mb-1 font-semibold text-white">{t('offices.address')}</h4>
                        <p className="text-sm text-white/50">
                          {resolve(office.addressEn, office.addressAr)}
                        </p>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-jerash-orange" />
                      <div>
                        <h4 className="mb-1 font-semibold text-white">{t('offices.hours')}</h4>
                        <p className="text-sm text-white/50">
                          {resolve(office.hoursEn, office.hoursAr)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="flex h-64 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <div className="text-center text-white/40">
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-white/20" />
                      <p className="text-sm">Map coming soon</p>
                      <p className="mt-1 text-xs">
                        {office.latitude.toFixed(4)}, {office.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}

        {/* Default state when no tab selected */}
        {!activeTab && (
          <div className="glass rounded-2xl">
            <div className="py-12">
              <div className="text-center text-white/40">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-white/20" />
                <p>Select an office above to view details</p>
              </div>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  )
}
