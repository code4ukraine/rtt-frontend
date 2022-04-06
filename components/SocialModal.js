import { useTranslation } from 'next-export-i18n';

import { trackSocialMediaClick } from '../utils/googleAnalytics';

const SocialModal = ({ setShowModal }) => {
  const { t } = useTranslation();

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className='social-modal-wrapper'>
      <div className='social-modal'>
        <button className='social-modal-close' onClick={handleClose}>
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M15 5L5 15'
              stroke='black'
              strokeWidth='1.5'
              strokeLinecap='square'
              strokeLinejoin='round'
            />
            <path
              d='M5 5L15 15'
              stroke='black'
              strokeWidth='1.5'
              strokeLinecap='square'
              strokeLinejoin='round'
            />
          </svg>
        </button>
        <h2 className='social-modal-title'>{t('reportAnEvent')}</h2>
        <p className='social-modal-copy'>
          {t('socialCTA')} <strong>#russian #forces</strong>{' '}
          {t('socialCTASpellingHint')}.
        </p>

        {/* copied from SocialBox, perhaps a good refactor is to componetize and use in both places */}
        <a
          style={{
            display: 'block',
            textAlign: 'center',
            lineHeight: '2rem',
            borderRadius: '3px',
            fontWeight: 600,
            padding: '10px',
            marginLeft: '0px',
            backgroundColor: '#FAE937',
            color: '#0D0D0D',
            cursor: 'pointer',
          }}
          onClick={() => {
            trackSocialMediaClick({ service: 'twitter' });
            window.open(
              'https://twitter.com/intent/tweet/?hashtags=russian,forces'
            );
          }}
        >
          {t('tweetAnEvent')}
          <div
            style={{
              height: '20px',
              width: '20px',
              display: 'inline-block',
              paddingLeft: '5px',
              color: '#0D0D0D',
              position: 'relative',
              top: 3,
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
              />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
};

export default SocialModal;
