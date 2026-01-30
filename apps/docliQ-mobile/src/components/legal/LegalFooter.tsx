import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PATHS } from '../../routes'

/**
 * Compact legal footer with links to Privacy, Terms, Impressum, and Cookie settings.
 * Required on all screens per GDPR transparency requirements.
 */
export default function LegalFooter() {
  const { t } = useTranslation('legal')
  const year = new Date().getFullYear()

  return (
    <footer className="py-4 px-4 text-center">
      <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <Link
          to={PATHS.LEGAL_PRIVACY}
          className="hover:text-teal-600 transition-colors"
        >
          {t('footer.privacy')}
        </Link>
        <span className="text-slate-300">|</span>
        <Link
          to={PATHS.LEGAL_TERMS}
          className="hover:text-teal-600 transition-colors"
        >
          {t('footer.terms')}
        </Link>
        <span className="text-slate-300">|</span>
        <Link
          to={PATHS.LEGAL_IMPRESSUM}
          className="hover:text-teal-600 transition-colors"
        >
          {t('footer.impressum')}
        </Link>
        <span className="text-slate-300">|</span>
        <Link
          to={PATHS.LEGAL_COOKIES}
          className="hover:text-teal-600 transition-colors"
        >
          {t('footer.cookies')}
        </Link>
      </nav>
      <p className="mt-2 text-xs text-slate-400">
        {t('footer.copyright', { year })}
      </p>
    </footer>
  )
}
