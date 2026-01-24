import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Container } from '@/components/layout/Container'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title={t('notFound.title', 'Page Not Found')}
        description={t('notFound.description', 'The page you are looking for does not exist.')}
        noindex
      />

      <Container as="section" className="py-20">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
          <h2 className="mt-4 text-2xl font-semibold">
            {t('notFound.heading', 'Page Not Found')}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t('notFound.message', "The page you are looking for doesn't exist or has been moved.")}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t('notFound.backHome', 'Back to Home')}
          </Link>
        </div>
      </Container>
    </>
  )
}
