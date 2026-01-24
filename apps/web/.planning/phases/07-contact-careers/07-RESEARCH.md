# Phase 7: Contact & Careers - Research

**Researched:** 2026-01-22
**Domain:** Form handling, file uploads, map integration, bilingual validation
**Confidence:** HIGH

## Summary

This phase implements three functional forms (contact inquiry, CV upload, job application) with bilingual validation, file upload with drag-and-drop, embedded maps using MapCN, and static content pages for partners/joint ventures. The standard approach combines react-hook-form for form state management with Zod for schema validation, react-dropzone for file uploads, and MapCN for maps (no API keys required). Forms simulate submission locally since backend integration is deferred.

**Key findings:**
- react-hook-form + Zod is the established pattern (already used in project)
- react-dropzone is the industry standard for file uploads (35k+ stars)
- MapCN provides free maps without API keys (built on MapLibre GL)
- File validation requires multiple layers (MIME type + size + extension checks)
- react-i18next validation messages need special handling for language switching

**Primary recommendation:** Use react-hook-form with zodResolver for all forms, integrate react-dropzone for CV uploads with Controller component, add MapCN for office locations, and handle bilingual error messages by returning translation keys instead of translated strings.

## Standard Stack

The established libraries/tools for form handling and file uploads:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | 7.x+ | Form state management | Industry standard, 41k+ stars, minimal re-renders, uncontrolled inputs |
| zod | 3.x/4.x | Schema validation | TypeScript-first, type inference, composable schemas |
| @hookform/resolvers | 3.x+ | Zod integration | Official resolver for react-hook-form + Zod |
| react-dropzone | 14.x+ | File drag-and-drop | 10M+ weekly downloads, HTML5 compliant, flexible design control |
| react-i18next | 14.x+ | Form i18n | Already in project, handles bilingual validation messages |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| MapCN | Latest | Embedded maps | Free maps without API keys, built on MapLibre GL |
| shadcn/ui Tabs | Latest | Office location tabs | Already in project, Radix UI powered, accessible |
| shadcn/ui Dialog | Latest | Job detail modals | Already in project, AnimatePresence compatible |
| Framer Motion | Latest | Success animations | Already in project, exit/enter animations for form states |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-dropzone | react-drag-drop-files | Less popular (fewer weekly downloads), but lighter weight |
| MapCN | Google Maps | Requires API key, billing setup, more complex |
| react-hook-form | Formik | More boilerplate, slower performance with large forms |

**Installation:**
```bash
pnpm add react-dropzone
# MapCN uses shadcn/ui pattern - copy components via CLI (see MapCN section)
# Other dependencies already installed in project
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── features/
│   ├── contact/
│   │   ├── components/
│   │   │   ├── ContactForm.tsx           # Main inquiry form
│   │   │   ├── OfficeLocations.tsx       # Tabbed office display
│   │   │   └── OfficeMap.tsx             # MapCN integration
│   │   ├── schemas/
│   │   │   └── contact-schema.ts         # Zod validation schema
│   │   └── ContactPage.tsx
│   ├── careers/
│   │   ├── components/
│   │   │   ├── CVUploadForm.tsx          # CV submission form
│   │   │   ├── JobListings.tsx           # Static job cards grid
│   │   │   ├── JobCard.tsx               # Individual job card
│   │   │   └── JobDetailModal.tsx        # Job details with apply button
│   │   ├── schemas/
│   │   │   └── cv-upload-schema.ts       # File validation schema
│   │   └── CareersPage.tsx
│   ├── partners/
│   │   ├── components/
│   │   │   └── PartnerCard.tsx           # Partner profile card
│   │   ├── data/
│   │   │   └── partners.ts               # Static partner data
│   │   └── PartnersPage.tsx
│   └── joint-ventures/
│       ├── components/
│       │   └── JointVentureCard.tsx      # JV profile card
│       ├── data/
│       │   └── joint-ventures.ts         # Static JV data
│       └── JointVenturesPage.tsx
├── components/
│   └── ui/                                # shadcn/ui components
│       ├── tabs.tsx                       # Already exists
│       ├── dialog.tsx                     # Already exists
│       └── ...
└── locales/
    ├── en/
    │   ├── contact.json                   # Contact form translations
    │   ├── careers.json                   # Careers translations
    │   ├── partners.json                  # Partners/JV translations
    │   └── validation.json                # Validation error keys
    └── ar/
        ├── contact.json
        ├── careers.json
        ├── partners.json
        └── validation.json
```

### Pattern 1: Form with react-hook-form + Zod
**What:** Controlled form state with schema-first validation
**When to use:** All forms in this phase (contact, CV upload, job application)
**Example:**
```typescript
// Source: https://ui.shadcn.com/docs/forms/react-hook-form
// schemas/contact-schema.ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, { error: 'validation.nameRequired' }),
  email: z.email({ error: 'validation.emailInvalid' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    error: 'validation.phoneInvalid'
  }).optional(),
  department: z.enum(['general', 'technical', 'careers', 'other']),
  message: z.string().min(10, { error: 'validation.messageTooShort' }),
})

export type ContactFormData = z.infer<typeof contactSchema>

// components/ContactForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'

function ContactForm() {
  const { t } = useTranslation('contact')
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: 'general',
      message: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    // Simulate submission (no backend)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Form submitted:', data)
    form.reset()
    setShowSuccess(true)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields with FormField components */}
      </form>
    </Form>
  )
}
```

### Pattern 2: File Upload with react-dropzone + react-hook-form
**What:** Drag-and-drop file upload integrated with form state
**When to use:** CV upload form
**Example:**
```typescript
// Source: https://github.com/orgs/react-hook-form/discussions/2146
// schemas/cv-upload-schema.ts
import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
]

export const cvUploadSchema = z.object({
  name: z.string().min(1, { error: 'validation.nameRequired' }),
  email: z.email({ error: 'validation.emailInvalid' }),
  phone: z.string().min(1, { error: 'validation.phoneRequired' }),
  cv: z.instanceof(File, { error: 'validation.cvRequired' })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      error: 'validation.cvTooLarge',
    })
    .refine(file => ACCEPTED_TYPES.includes(file.type), {
      error: 'validation.cvInvalidType',
    }),
})

export type CVUploadFormData = z.infer<typeof cvUploadSchema>

// components/CVUploadForm.tsx
import { useDropzone } from 'react-dropzone'
import { Controller } from 'react-hook-form'

function CVUploadForm() {
  const form = useForm<CVUploadFormData>({
    resolver: zodResolver(cvUploadSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Name, email, phone fields */}

        <Controller
          control={form.control}
          name="cv"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const { getRootProps, getInputProps, isDragActive } = useDropzone({
              accept: {
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/png': ['.png'],
              },
              maxFiles: 1,
              onDrop: (acceptedFiles) => {
                if (acceptedFiles.length > 0) {
                  onChange(acceptedFiles[0])
                }
              },
            })

            return (
              <div>
                <div
                  {...getRootProps()}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-8 cursor-pointer',
                    isDragActive ? 'border-primary bg-primary/5' : 'border-border',
                    error && 'border-destructive'
                  )}
                >
                  <input {...getInputProps()} />
                  {value ? (
                    <p>{value.name}</p>
                  ) : (
                    <p>{t('careers.dropzone.placeholder')}</p>
                  )}
                </div>
                {error && <p className="text-destructive">{t(error.message)}</p>}
              </div>
            )
          }}
        />
      </form>
    </Form>
  )
}
```

### Pattern 3: MapCN Integration
**What:** Embedded map with markers (no API keys needed)
**When to use:** Office locations display
**Example:**
```typescript
// Source: https://mapcn.vercel.app/docs
// Install MapCN components (shadcn/ui pattern):
// pnpm dlx shadcn@latest add "https://mapcn.vercel.app/r/map"
// pnpm dlx shadcn@latest add "https://mapcn.vercel.app/r/marker"

// components/OfficeMap.tsx
import { Map, Marker, NavigationControl } from '@/components/ui/map'

interface Office {
  id: string
  name: string
  coordinates: [number, number]
  phone: string
  email: string
  address: string
}

function OfficeMap({ office }: { office: Office }) {
  return (
    <Map
      initialViewState={{
        longitude: office.coordinates[0],
        latitude: office.coordinates[1],
        zoom: 14,
      }}
      style={{ width: '100%', height: '400px' }}
      mapStyle="light"
    >
      <Marker
        longitude={office.coordinates[0]}
        latitude={office.coordinates[1]}
        anchor="bottom"
      >
        <div className="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg" />
      </Marker>
      <NavigationControl position="top-right" />
    </Map>
  )
}
```

### Pattern 4: Simulated Form Submission
**What:** Local form submission simulation (no backend)
**When to use:** All forms in this phase until backend integration
**Example:**
```typescript
// Source: https://blog.jakoblind.no/react-forms-hooks/
const [isSubmitting, setIsSubmitting] = useState(false)
const [showSuccess, setShowSuccess] = useState(false)

const onSubmit = async (data: FormData) => {
  setIsSubmitting(true)

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Log data (inspect in console)
  console.log('Form submitted:', data)

  setIsSubmitting(false)
  setShowSuccess(true)

  // Reset form after showing success
  setTimeout(() => {
    form.reset()
    setShowSuccess(false)
  }, 3000)
}
```

### Pattern 5: Bilingual Validation Messages
**What:** Translation keys in error messages that update when language changes
**When to use:** All form validation
**Example:**
```typescript
// Source: https://github.com/orgs/react-hook-form/discussions/2632
// PROBLEM: Error messages don't update when language changes
// SOLUTION: Return translation keys, not translated strings

// ❌ BAD - Translated at schema definition
const schema = z.object({
  email: z.email({ error: t('validation.emailInvalid') }), // Frozen at init
})

// ✅ GOOD - Translation keys only
const schema = z.object({
  email: z.email({ error: 'validation.emailInvalid' }), // Key for later translation
})

// Then in component:
<FormMessage>
  {errors.email && t(errors.email.message)}
</FormMessage>

// Or with custom FormMessage wrapper:
function TranslatedFormMessage({ error }: { error?: FieldError }) {
  const { t } = useTranslation('validation')
  if (!error) return null
  return <p className="text-destructive text-sm">{t(error.message)}</p>
}
```

### Pattern 6: Success State Animation
**What:** Inline success message replacing form with Framer Motion animation
**When to use:** After successful form submission
**Example:**
```typescript
// Source: https://carlrippon.com/successful-submission-in-react-hook-form/
// Combined with Framer Motion patterns
import { AnimatePresence, motion } from 'motion/react'

function ContactForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  return (
    <AnimatePresence mode="wait">
      {!showSuccess ? (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Form fields */}
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('contact.successTitle')}</h3>
          <p className="text-muted-foreground">{t('contact.successMessage')}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Anti-Patterns to Avoid
- **Translating at schema definition:** Error messages become frozen in initial language
- **Using `value` instead of `defaultValue`:** react-hook-form uses uncontrolled inputs
- **Validating MIME type only:** Can be spoofed, combine with extension and size checks
- **Forgetting defaultValues:** Causes issues with controlled components and form reset
- **Not using Controller for react-dropzone:** Direct integration doesn't sync with form state

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| File drag-and-drop UI | Custom div with drag event handlers | react-dropzone | Handles edge cases (folder drops, multiple files, keyboard nav, mobile) |
| Form validation | Manual validation functions | Zod + zodResolver | Type safety, composable schemas, standardized error handling |
| Map rendering | Leaflet/Mapbox from scratch | MapCN | Free tiles, no API keys, shadcn/ui styling, copy-paste components |
| File MIME validation | `file.type` check only | Multi-layer validation (type + extension + size) | MIME can be spoofed, need defense in depth |
| Success animations | CSS transitions | Framer Motion AnimatePresence | Exit animations, orchestration, better mobile support |
| Phone validation | Simple regex | Zod with international regex `/^\+?[1-9]\d{1,14}$/` | E.164 format, handles country codes |

**Key insight:** Form handling appears straightforward but has deep complexity (validation timing, error display, state management, accessibility). The react-hook-form + Zod combo is battle-tested across millions of production forms and handles nuances like field arrays, conditional validation, and async validation that custom solutions miss.

## Common Pitfalls

### Pitfall 1: Validation Messages Not Updating on Language Change
**What goes wrong:** User changes language but form errors stay in old language
**Why it happens:** Zod schema captures translated strings at initialization, doesn't re-translate
**How to avoid:** Store translation keys in error messages, translate in component
**Warning signs:** Form works in English, errors don't update when switching to Arabic
**Example:**
```typescript
// ❌ BAD
const schema = z.object({
  email: z.email({ error: t('validation.emailInvalid') }) // Frozen at schema creation
})

// ✅ GOOD
const schema = z.object({
  email: z.email({ error: 'validation.emailInvalid' }) // Translation key
})

// In component:
{errors.email && <span>{t(errors.email.message)}</span>}
```

### Pitfall 2: Forgetting defaultValues in useForm
**What goes wrong:** Controlled components (like shadcn Select) don't work, form.reset() fails, isDirty doesn't detect changes
**Why it happens:** react-hook-form needs baseline to compare against
**How to avoid:** Always provide defaultValues, even empty strings
**Warning signs:** Select dropdown doesn't show value, form.reset() has no effect
**Example:**
```typescript
// ❌ BAD
const form = useForm<FormData>({
  resolver: zodResolver(schema),
})

// ✅ GOOD
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    name: '',
    email: '',
    department: 'general',
    message: '',
  },
})
```

### Pitfall 3: MIME Type Spoofing in File Uploads
**What goes wrong:** Malicious files bypass validation by spoofing Content-Type header
**Why it happens:** Browser-reported `file.type` can be manipulated
**How to avoid:** Validate MIME type, file extension, AND size; prepare for server-side validation
**Warning signs:** Accepting files based solely on `file.type` check
**Example:**
```typescript
// ❌ BAD - Only checking MIME type
const schema = z.object({
  file: z.instanceof(File)
    .refine(file => file.type === 'application/pdf')
})

// ✅ GOOD - Multi-layer validation
const ACCEPTED_TYPES = ['application/pdf', 'application/msword', '...']
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

const schema = z.object({
  file: z.instanceof(File, { error: 'validation.fileRequired' })
    .refine(file => file.size <= MAX_SIZE, {
      error: 'validation.fileTooLarge',
    })
    .refine(file => ACCEPTED_TYPES.includes(file.type), {
      error: 'validation.fileInvalidType',
    })
    .refine(file => {
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
      return ACCEPTED_EXTENSIONS.includes(ext)
    }, {
      error: 'validation.fileInvalidExtension',
    }),
})
```

### Pitfall 4: react-dropzone Not Syncing with react-hook-form
**What goes wrong:** Dropped files don't appear in form state, validation doesn't trigger
**Why it happens:** react-dropzone's `onDrop` doesn't automatically connect to react-hook-form
**How to avoid:** Use Controller component to bridge react-dropzone and react-hook-form
**Warning signs:** File selected but form.watch('file') is undefined
**Example:**
```typescript
// ❌ BAD - Direct integration
const { getRootProps, getInputProps } = useDropzone({
  onDrop: (files) => {
    // Files not in form state
    console.log(files)
  }
})

// ✅ GOOD - Controller integration
<Controller
  control={form.control}
  name="cv"
  render={({ field: { onChange, value } }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => {
        onChange(acceptedFiles[0]) // Syncs to form state
      }
    })
    return <div {...getRootProps()}>...</div>
  }}
/>
```

### Pitfall 5: Modal Form State Persisting Across Opens
**What goes wrong:** Job application modal reopens with old data from previous submission
**Why it happens:** Modal unmounts but form state doesn't reset
**How to avoid:** Reset form in modal's onOpenChange when closing, or use key prop to force remount
**Warning signs:** Opening modal shows previously entered data
**Example:**
```typescript
// ❌ BAD - No cleanup
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <JobApplicationForm />
</Dialog>

// ✅ GOOD - Reset on close
<Dialog
  open={isOpen}
  onOpenChange={(open) => {
    setIsOpen(open)
    if (!open) {
      form.reset()
    }
  }}
>
  <JobApplicationForm />
</Dialog>

// OR ✅ GOOD - Force remount with key
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <JobApplicationForm key={isOpen ? 'open' : 'closed'} />
</Dialog>
```

### Pitfall 6: tel: and mailto: Links Without Proper Formatting
**What goes wrong:** Phone links don't dial correctly, especially international numbers
**Why it happens:** Forgot to include + sign or E.164 format
**How to avoid:** Use E.164 format for tel: links (`+[country code][number]`)
**Warning signs:** Phone link works locally but fails for international users
**Example:**
```typescript
// ❌ BAD - No country code
<a href="tel:07701234567">Call Us</a>

// ✅ GOOD - E.164 format
<a href="tel:+9647701234567">+964 770 123 4567</a>

// mailto: always safe
<a href="mailto:info@example.com">Email Us</a>
```

## Code Examples

Verified patterns from official sources:

### Contact Form with Sidebar Layout
```tsx
// Two-column layout: form on left, office info on right
function ContactPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-[2fr,1fr] gap-8">
        {/* Left: Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('contact.formTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        {/* Right: Quick contact info */}
        <Card>
          <CardHeader>
            <CardTitle>{t('contact.quickContact')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {offices.map(office => (
              <div key={office.id}>
                <h4 className="font-semibold">{office.name}</h4>
                <a href={`tel:${office.phone}`} className="text-sm text-primary">
                  {office.phoneDisplay}
                </a>
                <a href={`mailto:${office.email}`} className="text-sm text-primary block">
                  {office.email}
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Below: Office locations with tabs */}
      <div className="mt-12">
        <OfficeLocations />
      </div>
    </div>
  )
}
```

### Tabbed Office Locations (No Default Tab)
```tsx
// Source: https://ui.shadcn.com/docs/components/tabs
function OfficeLocations() {
  const { t } = useTranslation('contact')
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined)

  const offices = [
    {
      id: 'basrah',
      name: t('offices.basrah.name'),
      coordinates: [47.7804, 30.4915],
      phone: '+9647701234567',
      email: 'basrah@jerash.com',
      address: t('offices.basrah.address'),
      hours: t('offices.basrah.hours'),
    },
    // ... erbil, baghdad
  ]

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        {offices.map(office => (
          <TabsTrigger key={office.id} value={office.id}>
            {office.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {offices.map(office => (
        <TabsContent key={office.id} value={office.id}>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">{t('offices.phone')}</h4>
                    <a href={`tel:${office.phone}`} className="text-primary">
                      {office.phone.replace(/^\+964/, '+964 ')}
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('offices.email')}</h4>
                    <a href={`mailto:${office.email}`} className="text-primary">
                      {office.email}
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('offices.address')}</h4>
                    <p className="text-sm text-muted-foreground">{office.address}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('offices.hours')}</h4>
                    <p className="text-sm text-muted-foreground">{office.hours}</p>
                  </div>
                </div>

                <div>
                  <OfficeMap office={office} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
```

### Job Listings Grid with Modal
```tsx
// Static job data structure ready for future API
const jobListings = [
  {
    id: 'job-001',
    title: 'Petroleum Engineer',
    department: 'Engineering',
    location: 'Basrah',
    type: 'Full-time',
    description: 'Brief description...',
    fullDescription: 'Full job description with requirements...',
  },
  // ... more jobs
]

function JobListings() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobListings.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => setSelectedJob(job)}
          />
        ))}
      </div>

      <JobDetailModal
        job={selectedJob}
        open={!!selectedJob}
        onOpenChange={(open) => !open && setSelectedJob(null)}
      />
    </>
  )
}

function JobDetailModal({ job, open, onOpenChange }) {
  const { t } = useTranslation('careers')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{job?.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{job?.department}</span>
            <span>•</span>
            <span>{job?.location}</span>
            <span>•</span>
            <span>{job?.type}</span>
          </div>

          <div className="prose prose-sm">
            {job?.fullDescription}
          </div>

          <Button
            className="w-full"
            onClick={() => {
              // Scroll to CV upload form or open apply modal
              onOpenChange(false)
              document.getElementById('cv-upload')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {t('jobs.applyButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Partner/JV Pages Structure
```tsx
// data/partners.ts - Static data ready for CMS
export const partners = [
  {
    id: 'slb',
    name: 'SLB',
    logo: '/images/partners/slb-logo.png',
    description: {
      en: 'SLB is a global technology company...',
      ar: 'إس إل بي هي شركة تقنية عالمية...',
    },
    website: 'https://www.slb.com',
  },
]

// PartnersPage.tsx
function PartnersPage() {
  const { t, i18n } = useTranslation('partners')

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map(partner => (
          <Card key={partner.id}>
            <CardContent className="pt-6">
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-20 object-contain mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{partner.name}</h3>
              <p className="text-muted-foreground text-sm">
                {partner.description[i18n.language as 'en' | 'ar']}
              </p>
              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm inline-flex items-center gap-1 mt-4"
                >
                  {t('visitWebsite')}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Zod 3.x `z.string().email()` | Zod 4.x `z.email()` | 2024 | Better tree-shaking, top-level validators |
| react-map-gl with Mapbox | MapCN with MapLibre GL | 2025 | No API keys, free tiles, shadcn/ui styled |
| Formik | react-hook-form | 2020-2021 | Less boilerplate, better performance, TypeScript support |
| Manual i18n error translation | Translation keys in schemas | Ongoing | Errors update when language changes |
| Custom dropzone | react-dropzone | Industry standard | Better accessibility, mobile support, edge case handling |
| Google Maps | MapCN/MapLibre alternatives | 2023-2024 | Free usage, no billing setup |

**Deprecated/outdated:**
- **z.string().email()**: Still works but Zod 4 recommends top-level `z.email()` for better bundle size
- **AnimatePresence without `mode` prop**: Framer Motion 7+ requires explicit mode ("wait", "sync", "popLayout")
- **react-hook-form without defaultValues**: Modern best practice always includes defaults

## Open Questions

Things that couldn't be fully resolved:

1. **MapCN Installation Process**
   - What we know: Uses shadcn/ui pattern (copy components, not npm install), requires specific CLI commands
   - What's unclear: Exact CLI syntax for installing map components, whether it requires custom Radix UI dependencies
   - Recommendation: Test installation first, fallback to manual component copy from MapCN docs if CLI fails

2. **File Upload Progress Indicators**
   - What we know: Simulated uploads don't need real progress, but good UX includes visual feedback
   - What's unclear: Best pattern for fake progress animation during setTimeout simulation
   - Recommendation: Simple spinner during submission, skip progress bar for simulated uploads

3. **Office Location Coordinates**
   - What we know: Need latitude/longitude for Basrah, Erbil, Baghdad offices
   - What's unclear: Exact coordinates for Jerash office locations
   - Recommendation: Use city center coordinates as placeholder, replace with actual addresses later

4. **Job Listing Data Structure**
   - What we know: Static for now, needs to be future-ready for CMS/API
   - What's unclear: What additional fields might be needed (salary range, benefits, application deadline)
   - Recommendation: Keep minimal (title, department, location, type, description) but structure as typed object for easy expansion

## Sources

### Primary (HIGH confidence)
- **shadcn/ui Tabs**: https://ui.shadcn.com/docs/components/tabs - Official component docs
- **shadcn/ui Form**: https://ui.shadcn.com/docs/forms/react-hook-form - Official react-hook-form integration
- **react-hook-form GitHub Discussions**: https://github.com/orgs/react-hook-form/discussions - File upload integration patterns
- **MapCN Documentation**: https://mapcn.vercel.app/docs - Official installation and usage
- **OWASP File Upload Cheat Sheet**: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html - Security best practices

### Secondary (MEDIUM confidence)
- **Wasp Blog - Advanced React Hook Form**: https://wasp.sh/blog/2025/01/22/advanced-react-hook-form-zod-shadcn (2025-01-22) - Recent best practices
- **react-dropzone GitHub**: https://github.com/react-dropzone/react-dropzone - 35k+ stars, industry standard
- **Framer Motion Modal Tutorial**: https://medium.com/@joeysuberu/modal-transition-animation-made-with-react-and-framer-motion-6dd2de36e996 - AnimatePresence patterns
- **RFC 6068 mailto URI Scheme**: https://www.rfc-editor.org/rfc/rfc6068 - Official standard for mailto links

### Secondary (MEDIUM confidence - continued)
- **React Hook Form Common Pitfalls**: https://alexhooley.com/blog/react-hook-form-common-mistakes - Experienced developer insights
- **Translating Validation Messages**: https://github.com/orgs/react-hook-form/discussions/2632 - Community solutions for i18n
- **File Upload Security**: https://portswigger.net/web-security/file-upload - MIME spoofing vulnerabilities

### Tertiary (LOW confidence)
- **WebSearch results** - Various blog posts and tutorials verified against official docs
- **Community discussions** - Stack Overflow, Reddit threads (not directly cited, used for validation only)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - react-hook-form, Zod, react-dropzone are industry standards with extensive documentation
- Architecture: HIGH - Patterns verified in official shadcn/ui and react-hook-form docs
- MapCN integration: MEDIUM - Newer library, documentation exists but less battle-tested than others
- Pitfalls: HIGH - Common issues well-documented in official discussions and OWASP guidelines
- Security practices: HIGH - Based on OWASP standards and official security documentation

**Research date:** 2026-01-22
**Valid until:** 30 days (stable ecosystem, libraries mature)

**Technology versions researched:**
- react-hook-form: 7.x (current stable)
- Zod: 3.x/4.x (both in use, 4.x recommended)
- react-dropzone: 14.x (current stable)
- MapCN: Latest (2025-2026 releases)
- Framer Motion: Latest (already in project)
