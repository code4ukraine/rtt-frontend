import SubmissionForm from "../components/SubmissionForm";
import { useTranslation } from 'next-export-i18n';
import MainBanner from '../components/Banners/MainBanner';

export default function Submission() {
  const { t } = useTranslation();
  return (
    <>
      <MainBanner />
      <div style={{
        padding: '10px 16px',
      }}>
        <h1>{t('formTitle')}</h1>
        <p>
          {t('formDescription')}
        </p>
        <SubmissionForm />
      </div>
    </>
  )
}
