import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
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
        <Skeleton className="mx-auto h-8 w-48" />
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
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
        <MapPin className="mx-auto mb-2 h-8 w-8 text-jerash-blue/30" />
        <p className="text-muted-foreground">{t('offices.noOffices')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-jerash-blue md:text-3xl">{t('offices.title')}</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          {offices.map((office) => (
            <TabsTrigger key={office.id} value={office.id}>
              {resolve(office.nameEn, office.nameAr)}
            </TabsTrigger>
          ))}
        </TabsList>

        {offices.map((office) => (
          <TabsContent key={office.id} value={office.id}>
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Office Details */}
                  <div className="space-y-4">
                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-5 w-5 shrink-0 text-jerash-orange" />
                      <div>
                        <h4 className="mb-1 font-semibold text-jerash-blue">{t('offices.phone')}</h4>
                        <a
                          href={`tel:${office.phone}`}
                          className="text-muted-foreground hover:text-jerash-orange transition-colors"
                        >
                          {office.phoneDisplay}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-jerash-orange" />
                      <div>
                        <h4 className="mb-1 font-semibold text-jerash-blue">{t('offices.email')}</h4>
                        <a
                          href={`mailto:${office.email}`}
                          className="text-muted-foreground hover:text-jerash-orange transition-colors"
                        >
                          {office.email}
                        </a>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-jerash-orange" />
                      <div>
                        <h4 className="mb-1 font-semibold text-jerash-blue">{t('offices.address')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resolve(office.addressEn, office.addressAr)}
                        </p>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-jerash-orange" />
                      <div>
                        <h4 className="mb-1 font-semibold text-jerash-blue">{t('offices.hours')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resolve(office.hoursEn, office.hoursAr)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="flex h-64 items-center justify-center rounded-lg border border-jerash-blue/10 bg-muted/50">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-jerash-blue/30" />
                      <p className="text-sm">Map coming soon</p>
                      <p className="mt-1 text-xs">
                        {office.latitude.toFixed(4)}, {office.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        {/* Default state when no tab selected */}
        {!activeTab && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-jerash-blue/30" />
                <p>Select an office above to view details</p>
              </div>
            </CardContent>
          </Card>
        )}
      </Tabs>
    </div>
  )
}
