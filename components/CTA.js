import { useTranslation } from 'next-export-i18n';

const CTA = ({ handleCTA }) => {
  const { t } = useTranslation();

  return (
    <button className='main-cta' onClick={handleCTA}>
      <span style={{ marginRight: 10 }}>{t('reportAnEvent')}</span>
      <svg
        className='cta-icon'
        width='25'
        height='24'
        viewBox='0 0 25 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M9.5 13C11.7091 13 13.5 11.2091 13.5 9C13.5 6.79086 11.7091 5 9.5 5C7.29086 5 5.5 6.79086 5.5 9C5.5 11.2091 7.29086 13 9.5 13Z'
          fill='#1D1C19'
        />
        <path
          d='M9.5 15C6.83 15 1.5 16.34 1.5 19V21H17.5V19C17.5 16.34 12.17 15 9.5 15ZM15.58 7.05C16.42 8.23 16.42 9.76 15.58 10.94L17.26 12.63C19.28 10.61 19.28 7.56 17.26 5.36L15.58 7.05ZM20.57 2L18.94 3.63C21.71 6.65 21.71 11.19 18.94 14.37L20.57 16C24.47 12.11 24.48 6.05 20.57 2Z'
          fill='#3F3D36'
        />
      </svg>
    </button>
  );
};

CTA.defaultProps = {
  handleCTA: () => {},
};

export default CTA;
