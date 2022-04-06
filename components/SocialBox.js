import {React} from 'react';
import {useTranslation} from 'next-export-i18n';
import {trackSocialMediaClick} from '../utils/googleAnalytics'

const SocialBox = () => {
  const {t} = useTranslation()
  return (
    <div
      style={{
        backgroundColor: '#FAE937',
        padding: '3vw',
        paddingTop: '20px',
        paddingBottom: '20px',
        marginTop: '30px',
      }}
      id="hashtag"
    >
      <h1
        style={{
          fontWeight: 'medium',
          underline: 'regular',
          textDecoration: 'underline',
        }}
      >
        #russian #forces
      </h1>
      <p
        style={{
          fontSize: '14px',
        }}
      >
      {t('socialCTA')}
      {' '}
      <strong style={{textDecoration: 'underline'}}>#russian #forces</strong>
      {' '}
      {t('socialCTASpellingHint')}.
      </p>
      <div
        style={{
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
      >
        {/* buttons */}
        <a
          style={{
            border: '1px solid #0D0D0D',
            borderRadius: '2px',
            fontWeight: 'regular',
            padding: '10px',
            marginLeft: '0px',
            color: '#0D0D0D',
            cursor: 'pointer',
          }}
          onClick={() => {
            trackSocialMediaClick({service: 'twitter'})
            window.open('https://twitter.com/intent/tweet/?hashtags=russian,forces');
          }}
        >
          Twitter
          <div
            style={{
              height: '20px',
              width: '20px',
              display: 'inline-block',
              paddingLeft: '10px',
              color: '#0D0D0D',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
};


export default SocialBox;
